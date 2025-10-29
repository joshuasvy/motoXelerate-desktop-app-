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
    <div className="flex flex-row justify-center items-center h-screen">
      <div className="w-[700px] px-28 py-10 justify-center bg-gray-800 rounded-xl shadow-xl">
        <img
          src="/images/logo/Starter pfp.jpg"
          alt="Logo"
          className="w-[70px] object-fill justify-center mx-auto mb-8"
        />
        <h1 className="text-3xl text-white font-bold mb-1">Welcome to</h1>{" "}
        <span className="text-3xl text-white font-bold">MotoXelerate</span>
        <div className="flex flex-col gap-5 mt-15 px-14 mt-7">
          <div className="flex flex-col">
            <label className="text-md text-white font-semibold mb-3">
              Email
            </label>
            <input
              type="text"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-2 mx-6 border-gray-600 shadow-md rounded"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-md text-white font-semibold mb-3">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-2 px-2 mx-6 border-gray-600 shadow-md rounded"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-4">
          <button
            onClick={handleLogin}
            className="rounded bg-green-500 py-2 w-72 text-black hover:bg-green-600 mt-8 text-md font-semibold"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-red-600 cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
