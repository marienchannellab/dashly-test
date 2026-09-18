import { useEffect, useState } from 'react'
import {
  getAnnouncementMessages,
  type AnnouncementMessage,
} from '../api/announcements'

const MESSAGE_DURATION = 4000

function AnnouncementBar() {
  const [messages, setMessages] = useState<AnnouncementMessage[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    async function loadMessages() {
      try {
        const data = await getAnnouncementMessages()
        setMessages(data)
      } catch (error) {
        console.error('Failed to load announcement messages:', error)
      }
    }

    loadMessages()
  }, [])

  useEffect(() => {
    if (messages.length <= 1) {
      return
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === messages.length - 1
          ? 0
          : currentIndex + 1,
      )
    }, MESSAGE_DURATION)

    return () => window.clearInterval(intervalId)
  }, [messages.length])

  if (messages.length === 0) {
    return <div className="announcement" aria-hidden="true" />
  }

  return (
    <div className="announcement" aria-live="polite">
      {messages.map((message, index) => (
        <p
          className={`announcement__message${index === activeIndex ? ' announcement__message--active' : ''}`}
          key={message.documentId}
          aria-hidden={index !== activeIndex}
        >
          {message.message}
        </p>
      ))}
    </div>
  )
}

export default AnnouncementBar
