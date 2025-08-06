import { v4 } from 'uuid'

export class Room {
  /**
   * @type {string[]}
   */
  #participants = []
  #id

  constructor() {
    this.#id = v4()
  }

  get id() {
    return this.#id
  }

  get participants() {
    return this.#participants
  }

  /**
   * 
   * @param {string} participantId 
   */
  join(participantId) {
    this.#participants.push(participantId)
  }

  /**
   * 
   * @param {string} participantId 
   */
  leave(participantId) {
    this.#participants = this.#participants.filter(currParticipantId => currParticipantId !== participantId)
  }
}