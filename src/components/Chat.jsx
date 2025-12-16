import { useContext, useEffect, useRef, useState, useMemo, useCallback, memo } from 'react'
import { marked } from 'marked'
import Loading from './Loading'
import Error from './Error'
import { DocumentProvidedContext } from '../context/UploadedContext'
import './chat.css'
import { SignedIn, SignedOut, SignInButton, useAuth } from '@clerk/clerk-react'
import PropTypes from 'prop-types'

const Chat = () => {
  const { noDoc } = useContext(DocumentProvidedContext)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)
  const { getToken } = useAuth()

  const API_URL = 'https://chatpdf-9g4j.onrender.com/api/v1/send'

  // Memoize input change handler to prevent recreation on every render
  const handleInputChange = useCallback((e) => {
    setInput(e.target.value)
  }, [])

  const FeatureCard = memo(({ icon, title, text }) => (
    <div className="flex gap-2 items-center flex-col">
      <img src={icon} alt={title} />
      <h3 className="font-bold">{title}</h3>
      <p className="text-center opacity-50">{text}</p>
    </div>
  ))

  FeatureCard.displayName = 'FeatureCard'

  FeatureCard.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }

  const Message = memo(({ content, isResponse }) => {
    // Memoize the marked conversion to avoid re-parsing on every render
    const htmlContent = useMemo(() => {
      return isResponse ? marked(content) : null
    }, [content, isResponse])

    return (
      <div className={`${isResponse ? 'rep' : 'msg'}`}>
        {isResponse ? (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        ) : (
          content
        )}
      </div>
    )
  })

  Message.displayName = 'Message'

  Message.propTypes = {
    content: PropTypes.string.isRequired,
    isResponse: PropTypes.bool.isRequired,
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    setError(null)
    setLoading(true)
    const currentQuestion = input.trim()

    // Add user message with unique ID for better React reconciliation
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), content: currentQuestion, isResponse: false },
    ])
    setInput('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ question: currentQuestion, noDoc }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(
          error?.includes('dimensions')
            ? 'Failed to respond. Try reuploading the document.'
            : 'Failed to fetch response. Please try again.'
        )
      }

      const { answer } = await response.json()
      setMessages((prev) => [...prev, { id: Date.now() + 1, content: answer, isResponse: true }])
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }, [input, noDoc, getToken])

  return (
    <div className="chat flex flex-col container mx-auto min-h-[calc(100vh-4rem)] relative">
      <SignedOut>
        <p className="text-center mt-10 px-4">
          You need to be signed in to access this page.
        </p>
        <SignInButton className="border rounded px-2 py-1 hover:bg-white hover:text-[#087C4C] transition-colors font-bold block mx-auto my-5" />
      </SignedOut>
      <SignedIn>
        {error && <Error error={error} setError={setError} />}

        <div className="chat-box flex flex-col items-center justify-center flex-1">
          {messages.length === 0 ? (
            <div className="features flex flex-col sm:flex-row justify-between gap-6 sm:gap-7 items-center container mx-auto min-h-[60vh] sm:min-h-[72vh] py-5 px-4">
              <FeatureCard
                icon="/assets/feat1.svg"
                title="Clear and precise"
                text="Get accurate and well-structured responses from your documents."
              />
              <FeatureCard
                icon="/assets/feat2.svg"
                title="Personalized answers"
                text="Receive contextual answers tailored to your specific questions."
              />
              <FeatureCard
                icon="/assets/feat3.svg"
                title="Increased efficiency"
                text="Save time by quickly finding information in your documents."
              />
            </div>
          ) : (
            <div className="mssgs-box py-2 flex w-full">
              <div className="mssgs h-[calc(100vh-200px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-160px)] overflow-y-auto w-full px-2 sm:px-4">
                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    content={msg.content}
                    isResponse={msg.isResponse}
                  />
                ))}
                {loading && (
                  <div className="rep">
                    <Loading />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        <form
          className="input-box sticky bottom-0 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm px-2 sm:px-4 pb-4 pt-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="enhanced-input outline-none rounded-2xl py-4 px-6 pr-16 w-full
                       bg-white/10 border-2 border-white/20 backdrop-blur-lg
                       text-white placeholder-white/60
                       focus:border-green-400/60 focus:bg-white/15 focus:scale-[1.02]
                       transition-all duration-300 ease-out
                       hover:border-white/30 hover:bg-white/12
                       disabled:opacity-50 disabled:cursor-not-allowed"
            required
            placeholder={
              messages.length === 0
                ? 'Example : “Explain quantum computing in simple terms”'
                : ''
            }
            value={input}
            onChange={handleInputChange}
          />
          <button
            style={{
              position: 'absolute',
              width: 35,
              height: 35,
              background: '#087C4C',
              right: 20,
              top: 8,
            }}
            type="submit"
            className="send rounded-md"
            disabled={loading}
          >
            <img src="/assets/send.svg" className="p-2" alt="Send message" />
          </button>
        </form>
      </SignedIn>
    </div>
  )
}

export default Chat
