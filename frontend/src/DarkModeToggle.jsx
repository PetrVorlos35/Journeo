import { useState, useEffect } from 'react';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.style.backgroundColor = darkMode ? 'black' : 'white';
  }, [darkMode]);
  

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className='rounded-full fill-white dark:fill-black hover:bg-gray-200 dark:hover:bg-gray-800 p-1 transition-all duration-200'
    >
      {darkMode ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 83.15 83.45" className="w-5 h-5">
          <path
            d="M41.6 15.48c2.05 0 3.76-1.76 3.76-3.81V3.76c0-2.05-1.71-3.76-3.76-3.76-2.1 0-3.81 1.71-3.81 3.76v7.91c0 2.05 1.71 3.81 3.81 3.81ZM60.06 23.2c1.46 1.46 3.9 1.51 5.42 0l5.62-5.57c1.42-1.47 1.42-3.93 0-5.36-1.46-1.46-3.9-1.46-5.36 0l-5.66 5.66c-1.42 1.42-1.42 3.86 0 5.27ZM67.72 41.7c0 2.05 1.76 3.76 3.81 3.76h7.81c2.1 0 3.81-1.71 3.81-3.76 0-2.05-1.71-3.81-3.81-3.81h-7.81c-2.05 0-3.81 1.76-3.81 3.81ZM60.06 60.25c-1.42 1.46-1.42 3.86 0 5.36l5.66 5.66c1.46 1.46 3.9 1.42 5.36 0 1.42-1.46 1.42-3.9 0-5.36l-5.66-5.57c-1.42-1.42-3.86-1.42-5.36 0ZM41.6 67.92c-2.1 0-3.81 1.76-3.81 3.81v7.91c0 2.05 1.71 3.76 3.81 3.76 2.05 0 3.76-1.71 3.76-3.76v-7.91c0-2.05-1.71-3.81-3.76-3.81ZM23.1 60.25c-1.46-1.46-3.95-1.46-5.42 0l-5.57 5.52c-1.46 1.46-1.46 3.95 0 5.42 1.46 1.46 3.9 1.42 5.36 0l5.62-5.57c1.46-1.51 1.46-3.9 0-5.36ZM15.43 41.7c0-2.05-1.71-3.81-3.81-3.81H3.81C1.71 37.89 0 39.65 0 41.7c0 2.05 1.71 3.76 3.81 3.76h7.81c2.1 0 3.81-1.71 3.81-3.76ZM23.05 23.2c1.46-1.42 1.46-3.9 0-5.36l-5.52-5.66c-1.46-1.46-3.95-1.42-5.42 0-1.42 1.46-1.42 3.9 0 5.36l5.57 5.66c1.51 1.42 3.9 1.42 5.36 0Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
          <path
            d="M41.6 61.57c10.94 0 19.88-8.89 19.88-19.87 0-10.99-8.94-19.87-19.88-19.87-10.99 0-19.92 8.88-19.92 19.87 0 10.98 8.93 19.87 19.92 19.87ZM41.6 54.98c-7.37 0-13.28-5.96-13.28-13.28 0-7.32 5.91-13.28 13.28-13.28 7.32 0 13.23 5.96 13.23 13.28 0 7.32-5.91 13.28-13.23 13.28Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 77.59 78.27" className="w-5 h-5">
          <path
            d="M60.25 51.9C39.45 51.9 26.76 39.4 26.76 19.29c0-5.81 1.22-10.99 2.58-13.52.63-1.22.73-1.81.73-2.69 0-1.37-1.32-3.08-3.13-3.08-.3 0-1.13.1-2.34.54C10.3 6.4 0 21.04 0 37.7c0 22.31 18.12 40.42 40.43 40.42 15.58 0 29.64-8.69 36.52-23.24.59-1.17.64-2.1.64-2.54 0-1.81-1.56-2.98-2.83-2.98-.73 0-1.17.05-2.2.44-3.32 1.27-7.76 2.1-12.27 2.1ZM6.84 37.4c0-11.43 5.76-22.37 15.24-28.76-1.22 3.42-1.81 7.08-1.81 11.35 0 24.07 14.36 38.28 38.92 38.28 3.81 0 6.93-.39 10.06-1.52-5.71 9.13-16.5 14.64-28.52 14.64-19.53 0-33.89-14.35-33.89-33.99Z"
            fill="currentColor"
            fillOpacity="0.85"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;
