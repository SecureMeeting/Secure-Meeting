import moment from "moment";
/**
 * Player Object
 * @param {String} socketId the socket id of the user
 */
export default class User {
  public name: String;
  public socketId: String;
  public isHost: Boolean;
  public timeCreated: String;
  public mousePosition: object;

  constructor(socketId: String) {
    this.name = "";
    this.socketId = socketId;
    this.isHost = false;
    this.timeCreated = moment().format();
    this.mousePosition = { x: 0, y: 0 };
  }

  set setIsHost(isHost: Boolean) {
    this.isHost = isHost;
  }

  set setName(newName: String) {
    this.name = newName;
  }

  updateMousePosition(position: object): void {
    this.mousePosition = position;
  }
}
