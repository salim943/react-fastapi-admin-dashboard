import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Todos() {
	  const style = {
    position: 'relative',
    top: '-300px'
  };
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: "", name: "", age: "" });
  const [todos, setTodos] = useState([{ title: "", description: "" }]);
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/"); // Redirect to login if no token
  }, [token, navigate]);

  const handleUserDetailsChange = (field, value) => {
    setUserDetails({ ...userDetails, [field]: value });
  };

  const handleTodoChange = (index, field, value) => {
    const newTodos = [...todos];
    newTodos[index][field] = value;
    setTodos(newTodos);
  };

  const handleAddTodo = () => {
    setTodos([...todos, { title: "", description: "" }]);
  };

  const handleRemoveTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };

  const handleInsertData = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage("Please login first.");
      return;
    }

    try {
      const payload = { user: userDetails, todos };
      const response = await axios.post(
        "http://127.0.0.1:8000/admin/insert_user_with_todos",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMessage("Data inserted successfully!");
    } catch (error) {
      setMessage("Data insertion failed: " + (error.response?.data?.detail || "Unknown error"));
    }
  };

  return (
    <div style={style} className="App min-h-screen bg-transparent flex flex-col items-center p-4">
      <section className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Insert User Data and Todos</h2>
        <form onSubmit={handleInsertData} className="flex flex-col gap-4">
          <h3 className="text-xl font-medium mb-2">User Details</h3>
          <input
            type="email"
            placeholder="Email"
            value={userDetails.email}
            onChange={(e) => handleUserDetailsChange("email", e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            placeholder="Name"
            value={userDetails.name}
            onChange={(e) => handleUserDetailsChange("name", e.target.value)}
            className="border p-2 rounded-md"
          />
          <input
            type="number"
            placeholder="Age"
            value={userDetails.age}
            onChange={(e) => handleUserDetailsChange("age", e.target.value)}
            className="border p-2 rounded-md"
          />
          <h3 className="text-xl font-medium mt-4 mb-2">Todos</h3>
          {todos.map((todo, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder={`Todo ${index + 1} Title`}
                value={todo.title}
                onChange={(e) => handleTodoChange(index, "title", e.target.value)}
                className="border p-2 rounded-md flex-1"
              />
              <input
                type="text"
                placeholder={`Todo ${index + 1} Description`}
                value={todo.description}
                onChange={(e) => handleTodoChange(index, "description", e.target.value)}
                className="border p-2 rounded-md flex-1"
              />
              <button
                type="button"
                onClick={() => handleRemoveTodo(index)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddTodo} className="bg-green-500 text-white p-2 rounded-md">
            Add Todo
          </button>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
            Insert Data
          </button>
        </form>
        {message && <p className="text-center mt-4 text-red-500">{message}</p>}
      </section>
    </div>
  );
}

export default Todos;