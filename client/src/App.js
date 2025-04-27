// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Jobs from './components/Jobs';
import JobForm from "./components/JobForm";
import Login from './components/Login';
import Signup from './components/Signup';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar /> {/* Navigation bar */}
      <Routes>
        <Route path="/" element={<Home />} />         {/* Home route */}
        <Route path="/jobs" element={<Jobs />} />     {/* Jobs route (with JobForm and JobList) */}
        <Route path="/post-job" element={<JobForm />} />
        <Route path="/login" element={<Login />} />   {/* Login route */}
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
