import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function ServiceHourForm({ hour, events, onSuccess, onCancel }) {
  const [eventId, setEventId] = useState(hour?.event_id || (events[0]?.event_id || ''));
  const [hours, setHours] = useState(hour?.hours || '');
  const [dateEarned, setDateEarned] = useState(hour?.date_earned || '');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (hour) {
        await axios.put(`/servicehours/${hour.hour_id}`, { event_id: eventId, hours, date_earned: dateEarned });
      } else {
        await axios.post('/servicehours', { event_id: eventId, hours, date_earned: dateEarned });
      }
      onSuccess && onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message || 'Error saving service hour');
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{display:'grid',gap:8}}>
      <select className='input' value={eventId} onChange={e=>setEventId(e.target.value)} required>
        {events.map(ev => <option key={ev.event_id} value={ev.event_id}>{ev.event_name}</option>)}
      </select>
      <input className='input' type='number' placeholder='Hours' value={hours} onChange={e=>setHours(e.target.value)} required min={0.1} step={0.1} />
      <input className='input' type='date' value={dateEarned} onChange={e=>setDateEarned(e.target.value)} required />
      {error && <div style={{color:'red'}}>{error}</div>}
      <div style={{display:'flex',gap:8}}>
        <button className='btn' type='submit'>{hour ? 'Update' : 'Create'}</button>
        {onCancel && <button type='button' className='btn' onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}
