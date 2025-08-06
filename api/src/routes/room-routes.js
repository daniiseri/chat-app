import { Router } from "express"
import { RoomMappers } from '../mappers/rooms.js'
import { roomRepositories } from "../repositories/rooms.js"

const roomRoutes = Router()

roomRoutes.post('/rooms', (req, res) => {
  const { roomId } = roomRepositories.create()

  res.status(201).send({ roomId })
})

roomRoutes.get('/rooms', (req, res) => {
  const rooms = roomRepositories.getAll().map((room) => RoomMappers.toHttp(room))
  res.send({ rooms })
})

roomRoutes.get('/rooms/:roomId', (req, res) => {
  const { roomId } = req.params

  const foundRoom = roomRepositories.getById(roomId)

  if (!foundRoom) return res.status(404).send('Room not found')

  res.send({
    id: foundRoom.id
  })
})

export { roomRoutes }