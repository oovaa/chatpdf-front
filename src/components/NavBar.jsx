import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaBars } from 'react-icons/fa'

const NavBar = () => {
  const location = useLocation()
  const [menuOpened, setMenuOpened] = useState(false)

  return (
    <div className="relative text-white border-b border-white container mx-auto flex justify-between items-center">
      <img className="w-24" src="/assets/chatpdfRobot.svg" alt="logo" />
      <nav className={`${menuOpened ? '' : 'max-md:hidden'}`}>
        <ul className="max-md:absolute left-1/2 bottom-0 max-md:-translate-x-1/2 max-md:translate-y-full max-md:backdrop-blur max-md:w-full z-20 text-center md:flex justify-center md:gap-10 lg:gap-14">
          <li className="py-2">
            <Link to="/" className="navBarItem">
              Home
            </Link>
          </li>
          <li className="py-2">
            {/* if location is upload page, show chat. And if chat show upload*/}
            {location.pathname === '/upload' ? (
              <Link to="/chat" className="navBarItem">
                Chat
              </Link>
            ) : (
              <Link to="/upload" className="navBarItem">
                Upload
              </Link>
            )}
          </li>
          <li className="py-2">
            <Link to="/about" className="navBarItem">
              About
            </Link>
          </li>
          <li></li>
        </ul>
      </nav>
      <button className="md:hidden" onClick={() => setMenuOpened(!menuOpened)}>
        <FaBars size={24} />
      </button>
    </div>
  )
}

export default NavBar
