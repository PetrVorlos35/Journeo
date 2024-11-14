
import googleLogo from "./assets/google.png";
// import Navbar from "./Navbar";

const LoginTest = () => {
  return (
    <div>
        {/* <Navbar/> */}
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Log in
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                Register here
              </a>
            </p>
          </div>

          <div className="relative flex items-center justify-center">
            <span className="absolute bg-white px-2 text-gray-500">Or continue with</span>
            <div className="w-full border-t border-gray-300 mt-4"></div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <img
                className="h-5 w-5 mr-2"
                src={googleLogo}
                alt="Google logo"
              />
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default LoginTest;
