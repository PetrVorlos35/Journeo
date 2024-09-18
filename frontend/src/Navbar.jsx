import { useState } from 'react';
import logo from './assets/Journeo_full.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-2xl sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-8">
        {/* Logo */}
        <div>
          <a href="/">
            <img src={logo} alt="Journeo Logo" className="h-10 w-auto" /> {/* Insert the logo image */}
          </a>
        </div>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex space-x-8">
          <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
          <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
          <a href="/features" className="text-gray-700 hover:text-blue-600">Features</a>
          <a href="/contact" className="text-gray-700 hover:text-blue-600">Contact</a>
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
        <a href="/" className="text-gray-700 hover:text-blue-600 text-xl">Home</a>
        <a href="/about" className="text-gray-700 hover:text-blue-600 text-xl">About</a>
        <a href="/features" className="text-gray-700 hover:text-blue-600 text-xl">Features</a>
        <a href="/contact" className="text-gray-700 hover:text-blue-600 text-xl">Contact</a>
      </div>
    </nav>
  );
}

export default Navbar;
