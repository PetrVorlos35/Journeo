import { useState } from 'react';
import Navbar from './Navbar';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      const data = await response.json();

      if (response.ok) {
        alert('User registered successfully!');
      } else {
        setErrorMessage(data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error connecting to the server.');
    }
  };

  return (
    <div>
        <Navbar />
      <div className="container mx-auto py-10">
      <h2 className="text-2xl mb-5 text-center">Login</h2>

      {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
    </div>
  );
}

export default LoginForm;
