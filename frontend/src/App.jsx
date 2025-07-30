// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';
import Admin from './Admin';
import Todos from './Todos';
import Dashboard from './Dashboard';

function App() {
  return (



    <div>

      <Router>
        <div>
          <Sidebar />
          <Routes>
			<Route path="/" element={<Admin />} />
			<Route path="/Todos" element={<Todos />} />
			<Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
