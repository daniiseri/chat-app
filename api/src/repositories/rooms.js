import { Room } from "../models/rooms.js";

class RoomRepositories {
  /**
   * @type {Room[]}
   */
  rooms = []

  create() {
    const newRoom = new Room()
    this.rooms.push(newRoom)

    return { roomId: newRoom.id }
  }

  /**
   * 
   * @param {string} roomId 
   */
  getById(roomId) {
    return this.rooms.find((room) => room.id === roomId)
  }

  getAll() {
    return this.rooms
  }

  getByParticipant(participantId) {
    return this.rooms.filter(room => room.participants.some(i => i === participantId))
  }
}

export const roomRepositories = new RoomRepositories()