class UserRepositories {
  /**
   * @type {User[]}
   */
  #users = []

  count() {
    return this.#users.length
  }

  getById(userId) {
    return this.#users.find((user) => user.id === userId)
  }

  getAll() {
    return this.#users
  }

  /**
   * 
   * @param {User} user 
   */
  join(user) {
    this.#users = [...this.#users, user]
  }

  /**
   * 
   * @param {string} userId 
   */
  leave(userId) {
    this.#users = this.#users.filter((user) => user.id !== userId)
  }
}

export const userRepositories = new UserRepositories()