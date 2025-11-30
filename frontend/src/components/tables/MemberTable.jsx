import React from 'react';

export default function MemberTable({ members, onEdit, onDelete }) {
  return (
    <table style={{width:'100%',background:'#fff',borderRadius:8}}>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>Classification</th>
          <th>Major</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {members.map(m => (
          <tr key={m.student_id}>
            <td>{m.first_name}</td>
            <td>{m.last_name}</td>
            <td>{m.email}</td>
            <td>{m.classification}</td>
            <td>{m.major}</td>
            <td>
              <button className='btn' onClick={()=>onEdit(m)}>Edit</button>
              <button className='btn' style={{marginLeft:8,background:'#ef4444'}} onClick={()=>onDelete(m.student_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
