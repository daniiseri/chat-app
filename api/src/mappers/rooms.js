import { Room } from "../models/rooms.js";

export class RoomMappers {

  /**
   * 
   * @param {Room} room 
   */
  static toHttp(room) {
    return {
      participants: room.participants.length,
      roomId: room.id
    }
  }
}