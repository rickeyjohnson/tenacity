import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);

  async function login(username, password){
    try {
  const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      const token = res.data.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(res.data.user);
      return res.data.user;
    } catch (err) {
      throw new Error(err?.response?.data?.message || 'Login failed');
    }
  }

  async function logout(){
    try {
  await axios.post(`${API_URL}/api/auth/logout`);
    } catch {}
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }

  return (<AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>);
}
export const useAuth = () => useContext(AuthContext);