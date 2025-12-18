import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://api-motoxelerate.onrender.com/api/admin/login", // ✅ admin endpoint
        { email, password }
      );

      const { admin, token } = res.data;

      localStorage.setItem("admin", JSON.stringify(admin));
      localStorage.setItem("token", token);

      navigate("/home"); // ✅ or "/admin/dashboard" if you want a separate route
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-gray-800 flex justify-center items-center h-screen">
      <div className="w-[500px] px-10 py-10 bg-gray-800 rounded-xl shadow-xl">
        {/* Logo */}
        <img
          src="/images/logo/motoxelerate.png"
          alt="Logo"
          className="w-[120px] object-fill bg-white rounded-full mx-auto mb-6"
        />

        {/* Title */}
        <h1 className="text-3xl text-white font-bold">
          Welcome to <span className="block mt-1">MotoXelerate</span>
        </h1>

        {/* Form */}
        <div className="flex flex-col gap-3 mt-8 px-8">
          <div className="flex flex-col items-center w-full">
            <label className="text-md text-white font-semibold self-start mb-2">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-sm w-full py-2 px-3 bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="flex flex-col items-center w-full mt-4">
            <label className="text-md text-white font-semibold self-start mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-sm w-full py-2 px-3 bg-transparent border-b border-gray-500 text-white focus:outline-none focus:border-green-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-4">
            <button
              onClick={handleLogin}
              className="rounded bg-green-500 py-2 w-full text-black hover:bg-green-600 text-md font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-red-500 hover:text-red-600 cursor-pointer text-right"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
