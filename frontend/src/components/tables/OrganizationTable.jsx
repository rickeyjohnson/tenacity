import React from 'react';

export default function OrganizationTable({ orgs, onEdit, onDelete }) {
  return (
    <table style={{width:'100%',background:'#fff',borderRadius:8}}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {orgs.map(org => (
          <tr key={org.org_id}>
            <td>{org.org_name}</td>
            <td>{org.category}</td>
            <td>
              <button className='btn' onClick={()=>onEdit(org)}>Edit</button>
              <button className='btn' style={{marginLeft:8,background:'#ef4444'}} onClick={()=>onDelete(org.org_id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
