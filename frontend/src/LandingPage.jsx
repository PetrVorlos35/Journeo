import React from 'react';

function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-green-500 text-white py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold">Learnify</h1>
          <p className="text-xl mt-4">Your ultimate e-learning platform for schools and teachers.</p>
          <a href="/signup" className="mt-6 inline-block bg-orange-500 text-white py-3 px-6 rounded-full text-lg hover:bg-orange-600 transition duration-300">Get Started</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">Why Learnify?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Task Management</h3>
              <p className="text-gray-600">Easily assign, track, and complete tasks with efficiency.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Interactive Learning</h3>
              <p className="text-gray-600">Engage students with interactive content and feedback.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Communication</h3>
              <p className="text-gray-600">Seamless communication between students and teachers.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4">Calendar Sync</h3>
              <p className="text-gray-600">Stay organized with integrated calendar features.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Start your journey today!</h2>
          <a href="/signup" className="inline-block bg-white text-orange-500 py-3 px-6 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white border-solid border-2 border-white transition duration-300">Sign Up Now</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Learnify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
