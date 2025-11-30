import React from 'react';

export default function ServiceHourTable({ hours, onEdit, onDelete }) {
  return (
    <table style={{width:'100%',background:'#fff',borderRadius:8}}>
      <thead>
        <tr>
          <th>Event</th>
          <th>Hours</th>
          <th>Date Earned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {hours.map(h => (
          <tr key={h.hour_id}>
            <td>{h.event_name}</td>
            <td>{h.hours}</td>
            <td>{h.date_earned}</td>
            <td>
              <button className='btn' onClick={()=>onEdit(h)}>Edit</button>
              <button className='btn' style={{marginLeft:8,background:'#ef4444'}} onClick={()=>onDelete(h.hour_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
