import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/Journeo_full.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };
  return (
    <nav className="bg-white shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8 ">
        {/* Logo */}
        <div>
          <a href="/">
            <img src={logo} alt="Journeo Logo" className="h-10 w-auto" /> {/* Insert the logo image */}
          </a>
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-8">
          {!isAuthenticated ? (
            <>
              <a href="/" className="text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
                Home
              </a>
            </>
          ) : (
            <>
              <a href="/dashboard" className="text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
                Dashboard
              </a>
            </>
          )}
          <a href="/about" className="relative text-gray-700 hover:text-blue-600 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
            About
          </a>

          <a href="/features" className="relative text-gray-700 hover:text-blue-600 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
            Features
          </a>
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 relative after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0">
                Register
              </Link>
            </>
          ) : (
            <a
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600 cursor-pointer after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-blue-600 after:left-1/2 after:bottom-0 after:transition-all after:duration-300 hover:after:w-full hover:after:left-0 relative"
            >
              Logout
            </a>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-white z-40 md:hidden flex flex-col justify-center items-center space-y-6 transition-transform duration-300 ${isOpen ? 'menu-open' : 'menu-closed'}`}>
        {/* Close Button */}
        <button onClick={toggleMenu} className="absolute top-4 right-4 text-gray-700 focus:outline-none">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Menu Links */}
        {!isAuthenticated ? (
          <>
            <a href="/" className="text-gray-700 hover:text-blue-600 text-xl">Home</a>
          </>
        ) : (
          <>
            <a href="/dashboard" className="text-gray-700 hover:text-blue-600 text-xl">Dashboard</a>
          </>
        )}
        <a href="/about" className="text-gray-700 hover:text-blue-600 text-xl">About</a>
        <a href="/features" className="text-gray-700 hover:text-blue-600 text-xl">Features</a>
        {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 text-xl">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600 text-xl">Register</Link>
            </>
          ) : (
            <a
              onClick={handleLogout}
              className="text-gray-700 hover:text-blue-600 cursor-pointer text-xl"
            >
              Logout
            </a>
          )}
      </div>
    </nav>
  );
}

export default Navbar;
