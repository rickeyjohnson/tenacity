import React, { useState } from 'react';
import axios from 'axios';

export default function MemberForm({ member, onSuccess, onCancel }) {
  const [firstName, setFirstName] = useState(member?.first_name || '');
  const [lastName, setLastName] = useState(member?.last_name || '');
  const [email, setEmail] = useState(member?.email || '');
  const [classification, setClassification] = useState(member?.classification || '');
  const [major, setMajor] = useState(member?.major || '');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (member) {
        await axios.put(`/members/${member.student_id}`, { first_name: firstName, last_name: lastName, email, classification, major });
      } else {
        await axios.post('/members', { first_name: firstName, last_name: lastName, email, classification, major });
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error saving member');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8}}>
      <input className='input' placeholder='First Name' value={firstName} onChange={e=>setFirstName(e.target.value)} required />
      <input className='input' placeholder='Last Name' value={lastName} onChange={e=>setLastName(e.target.value)} required />
      <input className='input' placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)} required />
      <input className='input' placeholder='Classification' value={classification} onChange={e=>setClassification(e.target.value)} required />
      <input className='input' placeholder='Major' value={major} onChange={e=>setMajor(e.target.value)} required />
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{display:'flex',gap:8}}>
        <button className='btn' type='submit'>{member ? 'Update' : 'Create'}</button>
        {onCancel && <button type='button' className='btn' onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
