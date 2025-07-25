import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://inventory-management-lvvi.onrender.com/api/auth/login', form);
      if (res.data.success) {
        toast.success(res.data.message);
        localStorage.setItem('token',res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-sky-200 to-blue-400">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo.webp" alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="Email" onChange={handleChange} className="w-full p-3 border rounded-md" required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className="w-full p-3 border rounded-md" required />
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-md">
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Don&apos;t have an account? <Link to="/register" className="text-blue-600 underline">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
