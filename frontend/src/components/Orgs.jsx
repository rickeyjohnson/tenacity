import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useAuth } from '../services/auth';

export default function Orgs(){
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { user } = useAuth();
  const role = user?.role || 'member';

  useEffect(()=> { fetchOrgs(); }, []);
  function fetchOrgs(){ axios.get('/api/organizations').then(r=>setOrgs(r.data)).catch(()=>{}); }

  async function createOrg(e){
    e.preventDefault();
    await axios.post('/api/organizations', { org_name: name, category });
    setName(''); setCategory(''); fetchOrgs();
  }

  function confirmDelete(id){ setDeleteId(id); setShowConfirm(true); }
  async function handleDelete(){
    await axios.delete(`/api/organizations/${deleteId}`);
    setShowConfirm(false); setDeleteId(null); fetchOrgs();
  }

  const filtered = orgs.filter(o => o.org_name.toLowerCase().includes(search.toLowerCase()) || o.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{background:'#fff',padding:16,borderRadius:8}}>
      <h3>Organizations</h3>
      <input className='input' placeholder='Search organizations...' value={search} onChange={e=>setSearch(e.target.value)} style={{marginBottom:8}} />
      {role !== 'member' && (
        <form onSubmit={createOrg} style={{display:'flex',gap:8,marginTop:12}}>
          <input className='input' placeholder='Org name' value={name} onChange={e=>setName(e.target.value)} required />
          <input className='input' placeholder='Category' value={category} onChange={e=>setCategory(e.target.value)} required />
          <button className='btn'>Create</button>
        </form>
      )}
      <ul style={{marginTop:12}}>{filtered.map(o=>(
        <li key={o.org_id} style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
          <div>{o.org_name} <small style={{color:'#6b7280'}}>({o.category})</small></div>
          <div>
            <button onClick={()=>navigator.clipboard.writeText(o.org_id)} style={{marginRight:8}}>CopyID</button>
            {role !== 'member' && <button onClick={()=>confirmDelete(o.org_id)} style={{color:'#ef4444'}}>Delete</button>}
          </div>
        </li>
      ))}</ul>
      {showConfirm && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'#0008',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',padding:24,borderRadius:8}}>
            <p>Are you sure you want to delete this organization?</p>
            <button className='btn' onClick={handleDelete}>Yes, Delete</button>
            <button className='btn' style={{marginLeft:8}} onClick={()=>setShowConfirm(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}