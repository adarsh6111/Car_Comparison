
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logoImg from "../Image/Logo.jpg";

const Signup = ({ onBackToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/signup", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      alert(res.data.message); 
      navigate("/login"); 
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
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
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Create an account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700"
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-3 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700"
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded-md bg-purple-900 text-white placeholder-purple-300 border border-purple-700"
        />

        <button
          onClick={handleSignup}
          className="w-full py-2 rounded-md bg-gradient-to-r from-pink-500 to-yellow-400 font-bold hover:from-pink-600 hover:to-pink-500 transition mb-2"
        >
          Sign Up
        </button>

        <button
          onClick={onBackToLogin || (() => navigate("/login"))}
          className="w-full py-2 rounded-md bg-purple-700 font-bold hover:bg-purple-600 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Signup;
