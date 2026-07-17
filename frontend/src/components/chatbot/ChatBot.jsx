import { useEffect, useRef, useState } from 'react'
import { matchAnswer, SUGGESTED_QUESTIONS } from './chatbotData'

const INITIAL_MESSAGE = {
  from: 'bot',
  text: "Hi, I'm the Lebeza assistant. Ask me anything about our clinic — hours, location, services, or booking.",
}

const ChatBot = () => {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const send = (text) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setMessages((m) => [...m, { from: 'user', text: trimmed }])
    setInput('')
    setTyping(true)

    // Simulated "thinking" delay so it reads like a live assistant.
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: matchAnswer(trimmed) }])
      setTyping(false)
    }, 500)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 w-[22rem] max-w-[calc(100vw-3rem)] rounded-2xl bg-cream border border-cream-darker shadow-card flex flex-col overflow-hidden" style={{ height: '28rem' }}>
          {/* Header */}
          <div className="bg-forest text-cream px-5 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <p className="font-serif text-base leading-none">Lebeza Assistant</p>
              <p className="text-cream/50 text-xs mt-1">Ask about our clinic</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-cream/70 hover:text-cream text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] px-4 py-2.5 rounded-2xl font-sans text-sm leading-relaxed ${
                  m.from === 'bot'
                    ? 'bg-cream-dark text-text-body mr-auto rounded-bl-sm'
                    : 'bg-forest text-cream ml-auto rounded-br-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            {typing && (
              <div className="bg-cream-dark text-text-muted mr-auto rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm font-sans w-fit">
                typing…
              </div>
            )}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-xs font-sans px-3 py-1.5 rounded-pill border border-cream-darker text-text-body hover:border-forest hover:text-forest transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-cream-darker px-3 py-3 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question…"
              className="flex-1 bg-transparent font-sans text-sm text-text-dark placeholder-text-muted focus:outline-none px-2"
            />
            <button
              type="submit"
              aria-label="Send"
              className="w-9 h-9 flex-shrink-0 rounded-full bg-forest text-cream flex items-center justify-center hover:bg-forest-mid transition-colors disabled:opacity-40"
              disabled={!input.trim()}
            >
              ↑
            </button>
          </form>
        </div>
      )}

      {/* Launcher button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        className="w-14 h-14 rounded-full bg-forest text-cream shadow-card flex items-center justify-center hover:bg-forest-mid transition-all duration-200 active:scale-90"
      >
        {open ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default ChatBot
