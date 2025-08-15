'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewStudentPage(){
  const router = useRouter();
  const [form, setForm] = useState({ slug:'', first_name:'', last_name:'', group_name:'toddlers', grade:'', photo_url:'', guardian_name:'', guardian_phone:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg('');
    try{
      const res = await fetch('/api/students', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      router.push('/students');
    } catch(e:any){ setMsg(e.message || String(e)); } finally { setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add Student</h2>
      <form onSubmit={submit} className="card space-y-3 max-w-xl">
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Legacy ID / Slug (e.g., S201)" value={form.slug} onChange={e=>setForm({...form, slug:e.target.value})} />
          <input className="input" placeholder="Grade" value={form.grade} onChange={e=>setForm({...form, grade:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="First name" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} required />
          <input className="input" placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="select" value={form.group_name} onChange={e=>setForm({...form, group_name:e.target.value})}>
            {['toddlers','beginners','primary','juniors','teens','telugu kids'].map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
          <input className="input" placeholder="Photo URL" value={form.photo_url} onChange={e=>setForm({...form, photo_url:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Guardian Name" value={form.guardian_name} onChange={e=>setForm({...form, guardian_name:e.target.value})} />
          <input className="input" placeholder="Guardian Phone" value={form.guardian_phone} onChange={e=>setForm({...form, guardian_phone:e.target.value})} />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving?'Saving…':'Save'}</button>
          {msg && <div className="text-sm opacity-70">{msg}</div>}
        </div>
      </form>
    </div>
  );
} 