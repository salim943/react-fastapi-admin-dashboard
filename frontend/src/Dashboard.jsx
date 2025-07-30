import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/"); // Redirect if not logged in
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/admin/users_with_todos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        setErrorMsg(
          error.response?.data?.detail || "Failed to fetch user data."
        );
      }
    };

    fetchData();
  }, [navigate, token]);

  // Helper function to download CSV
  const downloadCSV = () => {
    const headers = ["ID", "Name", "Email", "Age", "Todos"];
    const rows = data.map((item) => [
      item.user.id,
      item.user.name,
      item.user.email,
      item.user.age,
      item.todos.map(todo => `${todo.title}: ${todo.description}`).join("; ")
    ]);

    const csvContent =
      [headers.join(","), ...rows.map(row => row.map(cell => `"${cell}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "users_with_todos.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients and Their Detail</h1>
        <button
          onClick={downloadCSV}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Download CSV
        </button>
      </div>

      {errorMsg && <p className="text-red-500">{errorMsg}</p>}

      {data.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Age</th>
                <th className="py-2 px-4 border-b">Todos</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{item.user.id}</td>
                  <td className="py-2 px-4 border-b">{item.user.name}</td>
                  <td className="py-2 px-4 border-b">{item.user.email}</td>
                  <td className="py-2 px-4 border-b">{item.user.age}</td>
                  <td className="py-2 px-4 border-b">
                    {item.todos.length > 0
                      ? item.todos.map(todo => `${todo.title}: ${todo.description}`).join("; ")
                      : "No todos"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
