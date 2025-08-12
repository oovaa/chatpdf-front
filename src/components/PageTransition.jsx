import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import './page-transitions.css'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Start transition
    setIsVisible(false)
    
    // Show content after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return (
    <div className={`page-transition ${isVisible ? 'visible' : 'hidden'}`}>
      {children}
    </div>
  )
}

PageTransition.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PageTransition