'use client';
import { useEffect, useMemo, useState } from 'react';
import { fetchLeaders } from '@/lib/data';
import Link from 'next/link';

function Avatar({name, src}:{name:string;src?:string}){
  if (src) return <img src={src} alt="" className="w-full h-40 object-cover rounded" />;
  const initials = name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
  return <div className="w-full h-40 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-semibold">{initials}</div>;
}

export default function LeadersPage(){
  const [leaders, setLeaders] = useState<any[]>([]);
  const [q, setQ] = useState('');
  useEffect(()=>{ fetchLeaders().then(setLeaders); },[]);
  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase();
    if (!term) return leaders;
    return leaders.filter(l=> `${l.first_name} ${l.last_name}`.toLowerCase().includes(term));
  },[q, leaders]);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Sunday School Leaders</h2>
        <input className="input max-w-xs" placeholder="Search leader…" value={q} onChange={e=>setQ(e.target.value)} />
        <Link href={("/leaders/new" as any)} className="btn btn-primary">Add Leader</Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(l=>(
          <div key={l.id} className="card">
            <Avatar name={`${l.first_name} ${l.last_name}`} src={l.photo_url} />
            <div className="mt-2 font-medium">{l.first_name} {l.last_name}</div>
            <div className="text-xs opacity-70 capitalize">{l.role}</div>
            <div className="text-sm mt-2">Phone: {l.phone}</div>
            <div className="text-sm">Email: {l.email}</div>
            {l.assigned_groups?.length ? (
              <div className="text-xs opacity-70 mt-1">Groups: {l.assigned_groups.join(", ")}</div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}