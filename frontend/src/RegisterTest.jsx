import { useState } from "react";
import Navbar from "./Navbar";
import googleLogo from './assets/google.png';

const Register = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
    } else {
      setErrorMessage(""); // Clear the error message if they match
      // Proceed with form submission or any additional logic
      console.log("Registration successful");
    }
  };

  return (
    <div>
        <Navbar/>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
  <div className="rounded-md shadow-sm space-y-4">
    <div className="flex space-x-4">
      <div className="flex-1">
        <label htmlFor="username" className="sr-only">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Username"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Email address"
        />
      </div>
    </div>

    <div>
      <label htmlFor="password" className="sr-only">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Password"
      />
    </div>
    <div>
      <label htmlFor="confirm-password" className="sr-only">
        Confirm Password
      </label>
      <input
        id="confirm-password"
        name="confirm-password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="Confirm Password"
      />
    </div>
  </div>

  <div>
    <button
      type="submit"
      className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Register
    </button>
  </div>

  {errorMessage && (
    <p className="text-red-500 text-sm">{errorMessage}</p>
  )}

  <div className="flex items-center justify-between">
    <p className="text-sm text-gray-600">
      Already have an account?{" "}
      <a href="/login" className="text-indigo-600 hover:text-indigo-500">
        Log in here
      </a>
    </p>
  </div>

  <div className="relative flex items-center justify-center">
    <span className="absolute px-2 text-gray-500">Or continue with</span>
    <div className="w-full border-t border-gray-300 mt-4"></div>
  </div>

  <div className="flex justify-center mt-4">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <img className="h-5 w-5 mr-2" src={googleLogo} alt="Google logo" />
      Google
    </button>
  </div>
</form>

      </div>
    </div>
    </div>
  );
};

export default Register;
