import { useEffect, useState } from 'react'
import './components/background-effects.css'

const Circle = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="circle-container">
      {/* Main animated background circle */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
        className="main-circle"
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <rect
          x="-489"
          width="2777"
          height="2777"
          rx="1388.5"
          fill="url(#paint0_radial_main)"
          className="animate-pulse-slow"
        />
        <defs>
          <radialGradient
            id="paint0_radial_main"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(899.5 1388.5) rotate(90) scale(1388.5)"
          >
            <stop stopColor="#38FF77" stopOpacity="0.8">
              <animate
                attributeName="stop-opacity"
                values="0.8;0.4;0.8"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="0.5" stopColor="#22c55e" stopOpacity="0.3">
              <animate
                attributeName="stop-opacity"
                values="0.3;0.1;0.3"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="1" stopColor="#317647" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Floating particles */}
      <div className="floating-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              '--delay': `${i * 0.5}s`,
              '--duration': `${15 + Math.random() * 10}s`,
              '--size': `${2 + Math.random() * 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Interactive mouse glow */}
      <div
        className="mouse-glow"
        style={{
          left: mousePosition.x - 150,
          top: mousePosition.y - 150,
        }}
      />

      {/* Animated grid overlay */}
      <div className="grid-overlay">
        <svg width="100%" height="100%" className="grid-svg">
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="rgba(56, 255, 119, 0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
    </div>
  )
}

export default Circle
