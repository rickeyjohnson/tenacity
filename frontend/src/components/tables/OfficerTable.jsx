import React from 'react';

export default function OfficerTable({ officers, onEdit, onDelete }) {
  return (
    <table style={{width:'100%',background:'#fff',borderRadius:8}}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Organization</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {officers.map(o => (
          <tr key={o.officer_id}>
            <td>{o.name}</td>
            <td>{o.role}</td>
            <td>{o.org_name}</td>
            <td>
              <button className='btn' onClick={()=>onEdit(o)}>Edit</button>
              <button className='btn' style={{marginLeft:8,background:'#ef4444'}} onClick={()=>onDelete(o.officer_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
