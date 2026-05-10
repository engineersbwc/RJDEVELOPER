import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOTP from './pages/VerifyOTP';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="min-h-screen selection:bg-accent selection:text-white font-sans">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* 404 Page - Simplified for now */}
        <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-4">
            <h1 className="text-6xl font-bold mb-4 text-accent">404</h1>
            <p className="text-xl mb-8">Page Not Found</p>
            <a href="/" className="bg-accent text-slate-900 px-6 py-2 rounded-full font-bold">Go Home</a>
          </div>
        } />
      </Routes>
    </div>
  );
}

export default App;
