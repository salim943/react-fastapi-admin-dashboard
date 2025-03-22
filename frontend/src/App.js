// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar.js';
import './App.css';
import Admin from './Admin';
import Todos from './Todos';

function App() {
  return (



    <div>

      <Router>
        <div>
          <Sidebar />
          <Routes>
			<Route path="/" element={<Admin />} />
			<Route path="/Todos" element={<Todos />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
