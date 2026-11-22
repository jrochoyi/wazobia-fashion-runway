'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase, configured } from '../lib/supabase';

type Contestant = { id: string; name: string; tribe: string; story: string; image_url: string; votes?: number };
const tribes = ['Yoruba','Igbo','Hausa','Other'];
export default function Home() {
 const [people,setPeople] = useState<Contestant[]>([]); const [busy,setBusy]=useState(true); const [voted,setVoted]=useState(''); const [message,setMessage]=useState(''); const [filter,setFilter]=useState('All');
 useEffect(()=>{ const token=localStorage.getItem('wazobia-voter'); if(token)setVoted(localStorage.getItem('wazobia-voted')||''); load(); },[]);
 async function load(){ if(!configured){setBusy(false);return;} const {data,error}=await supabase.from('contestants').select('*').eq('active',true).order('created_at'); if(!error)setPeople(data||[]); setBusy(false); }
 const shown=useMemo(()=>people.filter(p=>filter==='All'||p.tribe===filter),[people,filter]);
 async function vote(id:string){ if(voted){setMessage('You have already cast your vote. Thank you!');return;} const token=localStorage.getItem('wazobia-voter')||crypto.randomUUID(); localStorage.setItem('wazobia-voter',token); setMessage(''); const {error}=await supabase.rpc('cast_vote',{p_contestant_id:id,p_voter_token:token}); if(error){setMessage(error.message.includes('duplicate')?'A vote has already been recorded from this device.':'Vote could not be submitted. Please try again.');return;} localStorage.setItem('wazobia-voted',id);setVoted(id);setMessage('Your vote has been counted. Thank you for celebrating our culture!'); }
 return <main><header className="top"><div className="brand"><span className="mark">W</span><span>CULTURAL SUNDAY</span></div><a className="adminLink" href="/admin">Admin</a></header>
 <section className="hero"><p className="eyebrow">YORUBA · IGBO · HAUSA · NIGERIA</p><h1>IBCF Wazobia<br/><span>Fashion Runway</span></h1><p className="intro">Culture in every thread. Pride in every look.<br/>Meet our contestants and cast your vote.</p><div className="heroRule"><span>CELEBRATE CULTURE</span><span>VOTE YOUR FAVOURITE</span></div></section>
 {!configured&&<div className="setup">Database not connected yet. Follow the setup instructions in the project README.</div>}
 <section className="gallery"><div className="sectionHeading"><div><p className="eyebrow">THE CONTESTANTS</p><h2>Who gets your vote?</h2></div><p className="hint">Tap a contestant to vote.<br/>One vote per device.</p></div><div className="filters">{['All',...tribes].map(t=><button key={t} className={filter===t?'active':''} onClick={()=>setFilter(t)}>{t}</button>)}</div>
 {busy?<p className="empty">Loading contestants…</p>:shown.length===0?<p className="empty">Contestants will appear here soon.</p>:<div className="grid">{shown.map((p,i)=><article className="person" key={p.id}><div className="photo"><img src={p.image_url} alt={p.name}/><span className="number">{String(i+1).padStart(2,'0')}</span></div><div className="personInfo"><div className="personTop"><h3>{p.name}</h3><span className="tribe">{p.tribe}</span></div><p className="story">{p.story}</p><button className="vote" disabled={!!voted} onClick={()=>vote(p.id)}>{voted===p.id?'Your vote ✓':voted?'Vote submitted':'Vote for '+p.name}<span>↗</span></button></div></article>)}</div>}
 {message&&<div className="toast">{message}</div>}
 </section><footer><span>IBCF WAZOBIA FASHION RUNWAY</span><span>Culture is our colour.</span></footer></main>;
}
