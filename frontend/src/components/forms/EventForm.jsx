import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventForm({ event, orgs, onSuccess, onCancel }) {
  const [eventName, setEventName] = useState(event?.event_name || '');
  const [eventDate, setEventDate] = useState(event?.event_date || '');
  const [location, setLocation] = useState(event?.location || '');
  const [orgId, setOrgId] = useState(event?.org_id || (orgs[0]?.org_id || ''));
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (event) {
        await axios.put(`/events/${event.event_id}`, { event_name: eventName, event_date: eventDate, location, org_id: orgId });
      } else {
        await axios.post('/events', { event_name: eventName, event_date: eventDate, location, org_id: orgId });
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error saving event');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8}}>
      <input className='input' placeholder='Event Name' value={eventName} onChange={e=>setEventName(e.target.value)} required />
      <input className='input' type='date' value={eventDate} onChange={e=>setEventDate(e.target.value)} required />
      <input className='input' placeholder='Location' value={location} onChange={e=>setLocation(e.target.value)} required />
      <select className='input' value={orgId} onChange={e=>setOrgId(e.target.value)} required>
        {orgs.map(o => <option key={o.org_id} value={o.org_id}>{o.org_name}</option>)}
      </select>
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{display:'flex',gap:8}}>
        <button className='btn' type='submit'>{event ? 'Update' : 'Create'}</button>
        {onCancel && <button type='button' className='btn' onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
