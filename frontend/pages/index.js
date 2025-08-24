import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Home(){
  const [affiliates, setAffiliates] = useState([]);
  const [err, setErr] = useState('');

  useEffect(()=>{
    api('/affiliates').then(setAffiliates).catch(e=>setErr(e.message));
  },[]);

  function select(id){ localStorage.setItem('aff', id); location.href='/dashboard'; }

  return (
    <main className="main-container">
  <h2>Affiliate Login (Simulation)</h2>
  {err && <p className="error-message">{err}</p>}
  <p>Select your affiliate:</p>
  <ul className="affiliate-list">
    {affiliates.map(a=>(
      <li key={a.id}>
        <button className="btn-primary" onClick={()=>select(a.id)}>
          #{a.id} - {a.name}
        </button>
      </li>
    ))}
  </ul>
</main>
  );
}
