import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OrganizationForm({ org, onSuccess, onCancel }) {
  const [orgName, setOrgName] = useState(org?.org_name || '');
  const [category, setCategory] = useState(org?.category || '');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (org) {
        await axios.put(`/organizations/${org.org_id}`, { org_name: orgName, category });
      } else {
        await axios.post('/organizations', { org_name: orgName, category });
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error saving organization');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8}}>
      <input className='input' placeholder='Organization Name' value={orgName} onChange={e=>setOrgName(e.target.value)} required />
      <input className='input' placeholder='Category' value={category} onChange={e=>setCategory(e.target.value)} required />
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{display:'flex',gap:8}}>
        <button className='btn' type='submit'>{org ? 'Update' : 'Create'}</button>
        {onCancel && <button type='button' className='btn' onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
