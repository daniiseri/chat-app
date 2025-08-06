import { createServer } from "http";
import { Server } from "socket.io";
import express from 'express'
import cors from 'cors'
import { User } from "./models/users.js";
import { routes } from "./routes/index.js";
import { roomRepositories } from "./repositories/rooms.js";
import { userRepositories } from "./repositories/users.js";

const app = express()
app.use(cors({
  origin: 'http://localhost:5173'
}))
app.use(routes)

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173'
  }
});

io.on("connection", async (socket) => {
  const user = new User(socket.id)
  userRepositories.join(user)

  io.emit('online', userRepositories.count())

  socket.on('create room', (roomId) => {
    io.emit(roomId)
  })

  socket.on('join room', (roomId) => {
    socket.join(roomId)
    const foundRoom = roomRepositories.getById(roomId)
    if (foundRoom) {
      foundRoom.join(user.id)
    }
  })

  socket.on('leave room', (roomId) => {
    socket.leave(roomId)
    const foundRoom = roomRepositories.getById(roomId)
    if (foundRoom) {
      foundRoom.leave(user.id)
    }
  })

  socket.on('messages', ({ roomId, message }) => {
    socket.to(roomId).emit('messages', message)
  })

  socket.on('disconnect', () => {
    userRepositories.leave(user.id)
    const foundRooms = roomRepositories.getByParticipant(user.id)
    for (const room of foundRooms) {
      room.leave(user.id)
    }

    io.emit('online', userRepositories.count())
  })
});

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})