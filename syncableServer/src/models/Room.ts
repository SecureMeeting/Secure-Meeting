import moment from "moment";
import User from "./User";
import { calculateDuration } from "../src/momentFunctions";
/**
 * Room Object
 * @param {String} name
 */
export default class Room {
  public name: String;
  public users: Array<User>;
  public componentStates: Map<string, any>;
  public timeCreated: String;

  constructor(name: String) {
    this.name = name;
    this.users = [];
    this.componentStates = new Map();
    this.timeCreated = moment().format();
  }

  get getUsers(): Array<User> {
    return this.users;
  }

  addUser(newUser: User): void {
    if (!this.hasUser(newUser)) {
      this.users.push(newUser);
      console.log(newUser.socketId + " joined the room: " + this.name);
    } else {
      console.log("User already in the room");
    }
  }

  hasUser(newUser: User): Boolean {
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].socketId === newUser.socketId) {
        return true;
      }
    }
    return false;
  }

  removeUser(socketId: String): void {
    let userToRemove = this.users.find((e) => e.socketId === socketId);
    if (userToRemove) {
      let userIndex = this.users.indexOf(userToRemove);
      this.users.splice(userIndex, 1); //removes user
    }
  }
}
