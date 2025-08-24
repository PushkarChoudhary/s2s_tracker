import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function Dashboard(){
  const [affId, setAffId] = useState(null);
  const [clicks, setClicks] = useState([]);
  const [convs, setConvs] = useState([]);
  const [template, setTemplate] = useState('');
  const [error, setError] = useState('');

  useEffect(()=>{
    const id = Number(localStorage.getItem('aff'));
    if(!id){ location.href='/'; return; }
    setAffId(id);
    load(id);
  },[]);

  async function load(id){
    try{
      const [c, v, t] = await Promise.all([
        api(`/affiliates/${id}/clicks`),
        api(`/affiliates/${id}/conversions`),
        api(`/affiliates/${id}/postback-template`)
      ]);
      setClicks(c); setConvs(v); setTemplate(t.template);
    }catch(e){ setError(e.message); }
  }

  return (
    <main className="main-container">
  <h2>Affiliate Dashboard (ID: {affId})</h2>
  {error && <p className="error-message">{error}</p>}

  <section className="card">
    <h3>Postback URL Format</h3>
    <code>{template}</code>
  </section>

  <section className="dashboard-grid">
    <div className="card table-wrapper">
      <h3>Clicks</h3>
      <table>
        <thead>
          <tr><th>ID</th><th>Campaign</th><th>ClickID</th><th>Time</th></tr>
        </thead>
        <tbody>
              {clicks.map(c=>(
                <tr key={c.id}>
                  <td>{c.id}</td><td>{c.campaignId}</td><td>{c.clickId}</td><td>{new Date(c.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
      </table>
    </div>

    <div className="card table-wrapper">
      <h3>Conversions</h3>
      <table>
        <thead><tr><th>ID</th><th>ClickID</th><th>Amount</th><th>Currency</th><th>Time</th></tr></thead>
            <tbody>
              {convs.map(v=>(
                <tr key={v.id}>
                  <td>{v.id}</td><td>{v.clickRefId}</td><td>{v.amount}</td><td>{v.currency}</td><td>{new Date(v.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
      </table>
    </div>
  </section>
</main>
  );
}
