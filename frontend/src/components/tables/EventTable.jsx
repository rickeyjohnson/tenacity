import React from 'react';

export default function EventTable({ events, onEdit, onDelete }) {
  return (
    <table style={{width:'100%',background:'#fff',borderRadius:8}}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
          <th>Location</th>
          <th>Organization</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {events.map(ev => (
          <tr key={ev.event_id}>
            <td>{ev.event_name}</td>
            <td>{ev.event_date}</td>
            <td>{ev.location}</td>
            <td>{ev.org_name}</td>
            <td>
              <button className='btn' onClick={()=>onEdit(ev)}>Edit</button>
              <button className='btn' style={{marginLeft:8,background:'#ef4444'}} onClick={()=>onDelete(ev.event_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
