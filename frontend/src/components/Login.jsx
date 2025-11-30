import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError('');
    try{
      await login(username, password);
      nav('/');
    }catch(err){
      setError(err.message);
    }
  }

  return (
    <div style={{maxWidth:420,margin:'40px auto',background:'#fff',padding:20,borderRadius:8}}>
      <h2 style={{marginBottom:12}}>Sign in</h2>
      <form onSubmit={submit} style={{display:'grid',gap:8}}>
        <input className='input' placeholder='Username' value={username} onChange={e=>setUsername(e.target.value)} />
        <input className='input' type='password' placeholder='Password' value={password} onChange={e=>setPassword(e.target.value)} />
        <button className='btn' type='submit'>Sign in</button>
      </form>
      {error && <div style={{color:'red',marginTop:8}}>{error}</div>}
    </div>
  );
}