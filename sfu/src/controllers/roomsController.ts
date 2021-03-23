import roomManagement from "../src/RoomManagement";
const CircularJSON = require("circular-json");
/**
 * API GET resource that returns the mediasoup Router RTP capabilities of
 * the room.
 */
export async function getRouterRtpCapabilities(req: any, res: any) {
  const data = req.room.getRouterRtpCapabilities();
  res.status(200).json(data);
}

/**
 * POST API to create a Broadcaster.
 */
export async function createBroadcaster(req: any, res: any, next: any) {
  const { id, displayName, device, rtpCapabilities } = req.body;

  try {
    const data = await req.room.createBroadcaster({
      id,
      displayName,
      device,
      rtpCapabilities,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * API GET resource that returns the mediasoup Router RTP capabilities of
 * the room.
 */
export async function deleteBroadcaster(req: any, res: any) {
  const { broadcasterId } = req.params;

  req.room.deleteBroadcaster({ broadcasterId });

  res.status(200).send("broadcaster deleted");
}

/**
 * POST API to create a mediasoup Transport associated to a Broadcaster.
 * It can be a PlainTransport or a WebRtcTransport depending on the
 * type parameters in the body. There are also additional parameters for
 * PlainTransport.
 */
export async function createBroadcasterTransport(
  req: any,
  res: any,
  next: any
) {
  const { broadcasterId } = req.params;
  const { type, rtcpMux, comedia } = req.body;

  try {
    const data = await req.room.createBroadcasterTransport({
      broadcasterId,
      type,
      rtcpMux,
      comedia,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * POST API to connect a Transport belonging to a Broadcaster. Not needed
 * for PlainTransport if it was created with comedia option set to true.
 */

export async function connectBroadcasterTransport(
  req: any,
  res: any,
  next: any
) {
  const { broadcasterId, transportId } = req.params;
  const { dtlsParameters } = req.body;

  try {
    const data = await req.room.connectBroadcasterTransport({
      broadcasterId,
      transportId,
      dtlsParameters,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * POST API to create a mediasoup Producer associated to a Broadcaster.
 * The exact Transport in which the Producer must be created is signaled in
 * the URL path. Body parameters include kind and rtpParameters of the
 * Producer.
 */

export async function createBroadcasterProducer(req: any, res: any, next: any) {
  const { broadcasterId, transportId } = req.params;
  const { kind, rtpParameters } = req.body;

  try {
    const data = await req.room.createBroadcasterProducer({
      broadcasterId,
      transportId,
      kind,
      rtpParameters,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

/**
 * POST API to create a mediasoup Consumer associated to a Broadcaster.
 * The exact Transport in which the Consumer must be created is signaled in
 * the URL path. Query parameters must include the desired producerId to
 * consume.
 */

export async function createBroadcasterConsumer(req: any, res: any, next: any) {
  const { broadcasterId, transportId } = req.params;
  const { producerId } = req.query;

  try {
    const data = await req.room.createBroadcasterConsumer({
      broadcasterId,
      transportId,
      producerId,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
  }
}

export async function createWebRtcTransport(req: any, res: any, next: any) {
  const { forceTcp, producing, consuming, sctpCapabilities } = req.body;

  try {
    const createWebRtcTransportResponse = await req.room.createWebRtcTransport(
      req.peer,
      forceTcp,
      producing,
      consuming,
      sctpCapabilities
    );

    res.status(200).json(createWebRtcTransportResponse);
  } catch (error) {
    console.error(error);
  }
}

export async function connectWebRtcTransport(req: any, res: any, next: any) {
  const { transportId, dtlsParameters } = req.body;

  try {
    await req.room.connectWebRtcTransport(
      req.peer,
      transportId,
      dtlsParameters
    );

    res.status(200).json(true);
  } catch (error) {
    console.error(error);
  }
}

export async function join(req: any, res: any, next: any) {
  const { device, rtpCapabilities, sctpCapabilities } = req.body;

  try {
    let roomCreatedResponse = await req.room.join(
      req.peer,
      device,
      rtpCapabilities,
      sctpCapabilities
    );
    res.status(200).json(roomCreatedResponse);
  } catch (error) {
    console.error(error);
  }
}

export async function produce(req: any, res: any, next: any) {
  const { transportId, kind, rtpParameters, appData } = req.body;

  try {
    let produceResponse = await req.room.produce(
      req.peer,
      transportId,
      kind,
      rtpParameters,
      appData
    );
    res.status(200).json(produceResponse);
  } catch (error) {
    console.error(error);
  }
}

export async function resumeConsumer(req: any, res: any, next: any) {
  const { consumerId } = req.body;

  try {
    let resumeConsumerResponse = await req.room.resumeConsumer(
      req.peer,
      consumerId
    );
    res.status(200).json(resumeConsumerResponse);
  } catch (error) {
    console.error(error);
  }
}

export async function closeProducer(req: any, res: any, next: any) {
  const { producerId } = req.body;

  try {
    let closeProducerResponse = await req.room.closeProducer(
      req.peer,
      producerId
    );
    res.status(200).json(closeProducerResponse);
  } catch (error) {
    console.error(error);
  }
}

export async function getRoom(req: any, res: any, next: any) {
  let peers = req.room._peers;
  let peersArr = [];

  for (let [key, value] of peers) {
    let peerCopy = JSON.parse(CircularJSON.stringify(value));
    delete peerCopy.socket;
    console.log(peerCopy);
    peerCopy.transports = Array.from(value.transports);
    peerCopy.producers = Array.from(value.producers);
    peerCopy.consumers = Array.from(value.consumers);

    peersArr.push(peerCopy);
  }

  try {
    res.status(200).json(peersArr);
  } catch (error) {
    console.error(error);
  }
}

export async function getAllRooms(req: any, res: any, next: any) {
  const map = roomManagement.rooms;

  let obj = Object.fromEntries(map);
  try {
    res.status(200).json(obj);
  } catch (error) {
    console.error(error);
  }
}
