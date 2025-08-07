import { useEffect, useRef, useState } from "react"
import { useLoaderData, useNavigate } from "react-router"
import { SendHorizonal, SmilePlus } from 'lucide-react'
import { socket } from "../libs/socket"
import { tv } from 'tailwind-variants';
import EmojiPicker from 'emoji-picker-react'

const messageVariants = tv({
  base: 'shadow w-3/4 mt-4 px-3 py-2 rounded-b-full bg-pink-900 relative',
  variants: {
    recipient: {
      false: 'rounded-r-full',
      true: 'rounded-l-full ml-auto'
    }
  },
  defaultVariants: {
    recipient: true
  }
})

export function Chat() {
  const data = useLoaderData()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [value, setValue] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (data?.error?.status === 404) {
      navigate('/')
    }

    socket.emit('join room', data.roomId)

    socket.on('messages', ({ value, date }) => {
      setMessages((prevState) => [...prevState, { value, date, recipient: true }])
    })
  }, [])

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight - ref.current.offsetHeight
    }
  }, [messages])

  function onChange(e) {
    setValue(e.target.value)
  }

  function onSubmit() {
    if (!value.length) return

    const date = new Date()
    setMessages(prevState => [...prevState, { value, recipient: false, date }])
    socket.emit('messages', { roomId: data.roomId, message: { value, date } })
    setValue('')
  }

  function onEmojiClick({ emoji }) {
    setValue(prevState => prevState + emoji)
  }

  function toggleShowEmojiPicker() {
    setShowEmojiPicker(!showEmojiPicker)
  }

  return (
    <div className="bg-pink-950 h-screen text-zinc-50 flex flex-col px-2 py-1 mx-auto lg:w-1/2">
      <div ref={ref} className="flex-1 overflow-auto">
        <ul>
          {
            messages?.map(({ value, recipient, date }, index) => (
              <li key={index} className={messageVariants({ recipient })}>
                {value}
                <span className="text-xs block absolute right-0 top-1/2 -translate-1/2">
                  {new Date(date).getHours()}:{new Date(date).getMinutes() < 10 ? `0${new Date(date).getMinutes()}` : new Date(date).getMinutes()}
                </span>
              </li>
            ))
          }
        </ul>
      </div>

      <div className="flex gap-2 px-3 py-2 relative">
        <SmilePlus className="cursor-pointer" onClick={toggleShowEmojiPicker} />
        <input
          onFocus={() => setShowEmojiPicker(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onSubmit()
            }
          }}
          type="text"
          value={value}
          onChange={onChange}
          className="rounded-lg bg-pink-900 shadow flex-1 px-1"
        />
        <div data-hidden={!showEmojiPicker} className="absolute -translate-y-full data-[hidden=true]:hidden">
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </div>
        <SendHorizonal onClick={onSubmit} />
      </div>
    </div>
  )
}