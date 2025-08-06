import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { socket } from '../libs/socket'
import { NavLink } from 'react-router'

export function Home() {
  const [rooms, setRooms] = useState([])
  const [errors, setErrors] = useState()
  const [countUsers, setCountUsers] = useState(0)

  useEffect(() => {
    socket.on('online', (count) => {
      console.log('entrou mais um')
      setCountUsers(count)
    })

    fetch('http://localhost:3000/rooms', {
      method: 'GET',
      headers: {
        'Contet-type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => setRooms(data.rooms))
  }, [])

  async function createRoom() {
    const response = await fetch('http://localhost:3000/rooms', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify({})
    })

    if (!response.ok) {
      const message = await response.text()
      setErrors(message)
    }

    const data = await response.json()

    setRooms([
      ...rooms,
      { roomId: data.roomId, participants: 0 }
    ])
  }

  return (
    <div className='h-screen'>
      <div className='flex justify-between'>
        <div>
          Salas de bate papo
        </div>

        <div>
          {
            errors
          }
          <button onClick={createRoom}><Plus /></button>
        </div>


        <div>
          Usuários online {countUsers}
        </div>
      </div>


      <table className='mx-auto'>
        <thead>
          <tr>
            <th>código</th>
            <th>usuários</th>
            <th></th>
          </tr>
        </thead>

        <tbody className='text-center'>
          {
            rooms?.map(({ roomId, participants }) => (
              <tr key={roomId} className='odd:bg-zinc-50'>
                <td>{roomId}</td>
                <td>{participants}</td>
                <td><NavLink to={`/chat/${roomId}`}>entrar</NavLink></td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}