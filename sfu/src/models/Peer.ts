import { types } from "mediasoup";
import moment from "moment";
import { Socket } from "socket.io";
/**
 * Player Object
 * @param {string} socketId the socket id of the user
 */
export default class Peer {
  public name: string;
  public socketId: string;
  public isHost: boolean;
  public timeCreated: string;
  public joined: boolean;
  public socket: Socket;
  //mediasoup
  public transports: Map<string, types.Transport>;
  public producers: Map<string, types.Producer>;
  public consumers: Map<string, types.Consumer>;
  public rtpCapabilities: types.RtpCapabilities | null;
  public sctpCapabilities: types.SctpCapabilities | null;
  public device: any;

  constructor(socketId: string, socket: Socket) {
    this.name = "";
    this.socketId = socketId;
    this.socket = socket;
    this.isHost = false;
    this.timeCreated = moment().format();

    this.transports = new Map();
    this.producers = new Map();
    this.consumers = new Map();

    this.rtpCapabilities = null;
    this.sctpCapabilities = null;
    this.device = null;
    this.joined = false;
  }

  set setIsHost(isHost: boolean) {
    this.isHost = isHost;
  }

  set setName(newName: string) {
    this.name = newName;
  }

  notify(messageType: string, message: any) {
    this.socket.emit(messageType, message);
  }
}
