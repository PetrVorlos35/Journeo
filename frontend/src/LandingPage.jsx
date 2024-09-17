import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from './Navbar';
import Footer from './Footer';

function LandingPage() {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleLoginClick = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div>
      <Navbar />
      {/* Header Section */}
      <header className="bg-gray-400 text-white py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Journeo</h1>
          <p className="text-lg mb-6">Your personal travel planner</p>
          <a onClick={handleLoginClick} className="bg-white text-gray-600 cursor-pointer py-3 px-6 rounded-full text-lg hover:bg-gray-200">
            Get Started
          </a>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Plan Your Next Adventure</h2>
          <p className="text-lg leading-relaxed">
            With Journeo, you can easily create detailed itineraries, track expenses, and explore new destinations. Whether you're traveling for business or pleasure, Journeo has got you covered.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Itinerary Planning</h3>
              <p>Create and organize your trips with ease.</p>
            </div>
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Expense Tracking</h3>
              <p>Keep an eye on your travel budget and spending.</p>
            </div>
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Map Integration</h3>
              <p>Visualize your routes and destinations with maps.</p>
            </div>
            <div className="feature-item p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Flight tracking</h3>
              <p>Track your flights and get real-time updates.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LandingPage;
