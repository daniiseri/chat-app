import './globals.css'
import { createRoot } from 'react-dom/client'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import { Home } from './pages/Home';
import { Chat } from './pages/Chat';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "chat/:roomId",
    element: <Chat />,
    loader: async ({ params }) => {
      const response = await fetch(`${env.API_URL}/rooms/${params.roomId}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json'
        }
      })

      if (!response.ok) {
        const message = await response.text()
        console.error(message)
        return { error: { status: response.status } }
      }

      return { roomId: params.roomId }
    }
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
