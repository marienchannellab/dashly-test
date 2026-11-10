import { useEffect, useState } from 'react'
import { announcementMessages } from '../data/catalog'

const MESSAGE_DURATION = 4000

function AnnouncementBar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const messages = announcementMessages

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
