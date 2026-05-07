
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "../Image/Logo.jpg";

const Login = ({ onSignupClick }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert(res.data.message); 
      navigate("/home"); 
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4">
      <img
        src={logoImg}
        alt="Logo"
        className="absolute top-4 left-4 w-16 h-16 object-contain"
      />

      <div className="bg-purple-950 bg-opacity-80 p-6 rounded-xl w-full max-w-sm shadow-xl">
        <img
          src={logoImg}
          alt="Logo"
          className="mx-auto w-20 h-20 object-contain mb-4"
        />

        <h2 className="text-2xl font-semibold mb-4 text-center">
          Welcome, Please sign in
        </h2>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-yellow-400 font-bold hover:from-pink-600 hover:to-pink-500 transition mb-2"
        >
          Log in
        </button>

        

        <button
          onClick={onSignupClick || (() => navigate("/signup"))}
          className="w-full py-2 rounded-md bg-purple-700 font-bold hover:bg-purple-600 transition"
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
