import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function OfficerForm({ officer, orgs, onSuccess, onCancel }) {
  const [orgId, setOrgId] = useState(officer?.org_id || (orgs[0]?.org_id || ''));
  const [name, setName] = useState(officer?.name || '');
  const [role, setRole] = useState(officer?.role || '');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (officer) {
        await axios.put(`/officers/${officer.officer_id}`, { org_id: orgId, name, role });
      } else {
        await axios.post('/officers', { org_id: orgId, name, role });
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error saving officer');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8}}>
      <select className='input' value={orgId} onChange={e=>setOrgId(e.target.value)} required>
        {orgs.map(o => <option key={o.org_id} value={o.org_id}>{o.org_name}</option>)}
      </select>
      <input className='input' placeholder='Officer Name' value={name} onChange={e=>setName(e.target.value)} required />
      <input className='input' placeholder='Role' value={role} onChange={e=>setRole(e.target.value)} required />
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{display:'flex',gap:8}}>
        <button className='btn' type='submit'>{officer ? 'Update' : 'Create'}</button>
        {onCancel && <button type='button' className='btn' onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
