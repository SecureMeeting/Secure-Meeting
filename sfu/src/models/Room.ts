const EventEmitter = require("events").EventEmitter;
import Logger from "./Logger";
const config = require("../config");
const logger = new Logger("Room");
import Peer from "./Peer";
import Bot from "./Bot";

import {
  types,
  version,
  observer,
  createWorker,
  getSupportedRtpCapabilities,
  parseScalabilityMode,
} from "mediasoup";
import { RtpParameters } from "mediasoup/lib/RtpParameters";

export default class Room extends EventEmitter {
  static async create(
    roomId: String,
    mediasoupWorker: types.Worker,
    forceH264: Boolean = false,
    forceVP9: Boolean = true
  ) {
    logger.info(
      "create() [roomId:%s, forceH264:%s, forceVP9:%s]",
      roomId,
      forceH264,
      forceVP9
    );

    // Create a protoo Room instance.

    // Router media codecs.
    let { mediaCodecs } = config.mediasoup.routerOptions;

    // If forceH264 is given, remove all video codecs but H264.
    if (forceH264) {
      mediaCodecs = mediaCodecs.filter(
        (codec: any) =>
          codec.kind === "audio" ||
          codec.mimeType.toLowerCase() === "video/h264"
      );
    }
    // If forceVP9 is given, remove all video codecs but VP9.
    if (forceVP9) {
      mediaCodecs = mediaCodecs.filter(
        (codec: any) =>
          codec.kind === "audio" || codec.mimeType.toLowerCase() === "video/vp9"
      );
    }

    // Create a mediasoup Router.
    const mediasoupRouter: types.Router = await mediasoupWorker.createRouter({
      mediaCodecs,
    });

    const bot = await Bot.create({ mediasoupRouter });

    return new Room(roomId, mediasoupRouter, bot);
  }

  constructor(roomId: String, mediasoupRouter: types.Router, bot: Bot) {
    super();
    this.setMaxListeners(Infinity);

    // Room id.
    // @type {String}
    this._roomId = roomId;

    // Closed flag.
    // @type {Boolean}
    this._closed = false;

    // Map of broadcasters indexed by id. Each Object has:
    // - {String} id
    // - {Object} data
    //   - {String} displayName
    //   - {Object} device
    //   - {RTCRtpCapabilities} rtpCapabilities
    //   - {Map<String, mediasoup.Transport>} transports
    //   - {Map<String, mediasoup.Producer>} producers
    //   - {Map<String, mediasoup.Consumers>} consumers
    //   - {Map<String, mediasoup.DataProducer>} dataProducers
    //   - {Map<String, mediasoup.DataConsumers>} dataConsumers
    // @type {Map<String, Object>}
    this._broadcasters = new Map();
    // Map of Peers indexed by socketId.
    //@type {Map<String, Object>}
    this._peers = new Map();

    // mediasoup Router instance.
    // @type {mediasoup.Router}
    this._mediasoupRouter = mediasoupRouter;

    // DataChannel bot.
    // @type {Bot}
    this._bot = bot;

    // Network throttled.
    // @type {Boolean}
    this._networkThrottled = false;
  }

  getRouterRtpCapabilities() {
    return this._mediasoupRouter.rtpCapabilities;
  }

  async createWebRtcTransport(
    peer: Peer,
    forceTcp: boolean,
    producing: boolean,
    consuming: boolean,
    sctpCapabilities: types.SctpCapabilities | undefined
  ) {
    console.log("ROOM | createWebRtcTransport()");
    console.log("Producing:", producing);
    console.log("Consuming:", consuming);
    const webRtcTransportOptions = {
      ...config.mediasoup.webRtcTransportOptions,
      enableSctp: Boolean(sctpCapabilities),
      numSctpStreams: (sctpCapabilities || {}).numStreams,
      appData: { producing, consuming },
    };

    if (forceTcp) {
      webRtcTransportOptions.enableUdp = false;
      webRtcTransportOptions.enableTcp = true;
    }

    const transport = await this._mediasoupRouter.createWebRtcTransport(
      webRtcTransportOptions
    );

    const { maxIncomingBitrate } = config.mediasoup.webRtcTransportOptions;

    // If set, apply max incoming bitrate limit.
    if (maxIncomingBitrate) {
      try {
        await transport.setMaxIncomingBitrate(maxIncomingBitrate);
      } catch (error) {}
    }

    // Store the WebRtcTransport into the Peer Object.
    peer.transports.set(transport.id, transport);
    return {
      id: transport.id,
      iceParameters: transport.iceParameters,
      iceCandidates: transport.iceCandidates,
      dtlsParameters: transport.dtlsParameters,
      sctpParameters: transport.sctpParameters,
    };
  }

  async connectWebRtcTransport(
    peer: Peer,
    transportId: string,
    dtlsParameters: types.DtlsParameters
  ) {
    console.log("connectWebRtcTransport() with id#", transportId);
    const transport = peer.transports.get(transportId);
    if (!transport)
      throw new Error(`transport with id "${transportId}" not found`);
    await transport.connect({ dtlsParameters });
  }

  async join(
    peer: Peer,
    device: any,
    rtpCapabilities: types.RtpCapabilities,
    sctpCapabilities: types.SctpCapabilities
  ) {
    // Ensure the Peer is not already joined.
    if (peer.joined) {
      throw new Error("Peer already joined");
    }

    peer.joined = true;
    peer.device = device;
    peer.rtpCapabilities = rtpCapabilities;
    peer.sctpCapabilities = sctpCapabilities;

    const joinedPeers = [
      ...this._getJoinedPeers(),
      ...this._broadcasters.values(),
    ];

    console.log("joinedPeers");
    console.log(joinedPeers);

    const peerInfos = joinedPeers
      .filter((joinedPeer: Peer) => joinedPeer.socketId !== peer.socketId)
      .map((joinedPeer: Peer) => ({
        id: joinedPeer.socketId,
        displayName: joinedPeer.name,
        device: joinedPeer.device,
      }));

    for (const joinedPeer of joinedPeers) {
      // Create Consumers for existing Producers.
      for (const producer of joinedPeer.producers.values()) {
        this._createConsumer(peer, joinedPeer, producer);
      }
    }

    // Notify the new Peer to all other Peers.
    //@ts-ignore
    for (const otherPeer of this._getJoinedPeers({ excludePeer: peer })) {
      otherPeer.notify("newPeer", {
        id: peer.socketId,
        displayName: peer.name,
        device: peer.device,
      });
    }

    return { peers: peerInfos };
  }

  /**
   * Creates a mediasoup Consumer for the given mediasoup Producer.
   *
   * @async
   */
  async _createConsumer(
    consumerPeer: Peer,
    producerPeer: Peer,
    producer: types.Producer
  ) {
    console.log("_createConsumer()");
    // NOTE: Don't create the Consumer if the remote Peer cannot consume it.
    if (
      !consumerPeer.rtpCapabilities ||
      !this._mediasoupRouter.canConsume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.rtpCapabilities,
      })
    ) {
      return;
    }

    // Must take the Transport the remote Peer is using for consuming.
    const transport = Array.from(consumerPeer.transports.values()).find(
      (t) => t.appData.consuming
    );

    // This should not happen.
    if (!transport) {
      logger.warn("_createConsumer() | Transport for consuming not found");

      return;
    }

    // Create the Consumer in paused mode.
    let consumer: types.Consumer;

    try {
      consumer = await transport.consume({
        producerId: producer.id,
        rtpCapabilities: consumerPeer.rtpCapabilities,
        paused: true,
      });
    } catch (error) {
      console.error("_createConsumer()", error);
      return;
    }

    console.log("SETTING CONSUMER");
    // Store the Consumer into the protoo consumerPeer data Object.
    consumerPeer.consumers.set(consumer.id, consumer);

    // Set Consumer events.
    consumer.on("transportclose", () => {
      // Remove from its map.
      consumerPeer.consumers.delete(consumer.id);
    });

    consumer.on("producerclose", () => {
      // Remove from its map.
      consumerPeer.consumers.delete(consumer.id);
      consumerPeer.notify("consumerClosed", { consumerId: consumer.id });
    });

    consumer.on("producerpause", () => {
      consumerPeer.notify("consumerPaused", { consumerId: consumer.id });
    });

    consumer.on("producerresume", () => {
      consumerPeer.notify("consumerResumed", { consumerId: consumer.id });
    });

    consumer.on("score", (score) => {
      consumerPeer.notify("consumerScore", { consumerId: consumer.id, score });
    });

    consumer.on("layerschange", (layers) => {
      consumerPeer.notify("consumerLayersChanged", {
        consumerId: consumer.id,
        spatialLayer: layers ? layers.spatialLayer : null,
        temporalLayer: layers ? layers.temporalLayer : null,
      });
    });

    try {
      console.log("Notifying peer about new consumer");

      await consumerPeer.notify("newConsumer", {
        peerId: producerPeer.socketId,
        producerId: producer.id,
        id: consumer.id,
        kind: consumer.kind,
        rtpParameters: consumer.rtpParameters,
        type: consumer.type,
        appData: producer.appData,
        producerPaused: consumer.producerPaused,
      });

      // Now that we got the positive response from the remote endpoint, resume
      // the Consumer so the remote endpoint will receive the a first RTP packet
      // of this new stream once its PeerConnection is already ready to process
      // and associate it.

      //resume the consumer in the "resumeConsumer function"
      //consumer.resume();
    } catch (error) {
      console.error("_createConsumer() | failed:", error);
    }
  }

  async produce(
    peer: Peer,
    transportId: string,
    kind: any,
    rtpParameters: RtpParameters,
    appData: any
  ) {
    console.log("produce()");
    // Ensure the Peer is joined.
    if (!peer.joined) throw new Error("Peer not yet joined");

    const transport = peer.transports.get(transportId);

    if (!transport)
      throw new Error(`transport with id "${transportId}" not found`);

    // Add peerId into appData to later get the associated Peer during
    // the 'loudest' event of the audioLevelObserver.
    appData = { ...appData, peerId: peer.socketId };

    const producer = await transport.produce({
      kind,
      rtpParameters,
      appData,
      // keyFrameRequestDelay: 5000
    });

    console.log("storing producer in peer:", producer.id);
    // Store the Producer into the protoo Peer data Object.
    peer.producers.set(producer.id, producer);

    // Set Producer events.
    producer.on("score", (score) => {
      // logger.debug(
      // 	'producer "score" event [producerId:%s, score:%o]',
      // 	producer.id, score);

      peer.notify("producerScore", { producerId: producer.id, score });
    });

    // Optimization: Create a server-side Consumer for each Peer.
    //@ts-ignore
    for (const otherPeer of this._getJoinedPeers({ excludePeer: peer })) {
      this._createConsumer(otherPeer, peer, producer);
    }

    /*
    // Add into the audioLevelObserver.
    if (producer.kind === "audio") {
      this._audioLevelObserver
        .addProducer({ producerId: producer.id })
        .catch(() => {});
    }
    */

    return { id: producer.id };
  }

  async resumeConsumer(peer: Peer, consumerId: string) {
    console.log("resumeConsumer() resuming consumer #", consumerId);
    // Ensure the Peer is joined.
    if (!peer.joined) {
      throw new Error("Peer not yet joined");
    }

    const consumer = peer.consumers.get(consumerId);

    if (!consumer)
      throw new Error(`consumer with id "${consumerId}" not found`);

    await consumer.resume();

    peer.notify("consumerScore", {
      consumerId: consumer.id,
      score: consumer.score,
    });

    return;
  }

  async closeProducer(peer: Peer, producerId: string) {
    console.log("closeProducer() closing producer #", producerId);
    // Ensure the Peer is joined.
    if (!peer.joined) {
      throw new Error("Peer not yet joined");
    }

    const producer = peer.producers.get(producerId);

    if (!producer) {
      throw new Error(`producer with id "${producerId}" not found`);
    }

    await producer.pause();
  }

  getPeer(peerId: string) {
    return this._peers.get(peerId);
  }

  getNumberOfPeers() {
    return Array.from(this._peers).length;
  }

  /**
   * Helper to get the list of joined peers.
   */
  _getJoinedPeers({ excludePeer = undefined } = {}) {
    let peerArr: Array<Peer> = Array.from(this._peers.values());
    return peerArr.filter((peer: Peer) => peer.joined && peer !== excludePeer);
  }

  addPeer(peer: Peer) {
    console.log("adding peer to room!!!");
    this._peers.set(peer.socketId, peer);
    console.log(this._peers);
  }

  removePeer(peerId: string) {
    this._peers.delete(peerId);
  }
}
