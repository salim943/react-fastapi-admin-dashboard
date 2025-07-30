import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Admin() {
	  const style = {
    position: 'relative',
    top: '-200px'
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (message) alert(message);
  }, [message]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/token",
        `username=${username}&password=${password}`,
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      localStorage.setItem("token", response.data.access_token);
      setMessage("Login successful!");
      navigate("/Todos");
    } catch (error) {
      setMessage("Login failed: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div style = {style} className="App bg-transparent flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Panel</h1>
      <section className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Login
          </button>
        </form>
      </section>
    </div>
  );
}

export default Admin;
