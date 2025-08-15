'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditStudentPage(){
  const params = useParams();
  const router = useRouter();
  const id = String((params as any)?.id);
  const [form, setForm] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    (async()=>{
      const res = await fetch(`/api/students/${id}`, { method:'GET' });
      let data = null;
      if (!res.ok) {
        // fallback via client query on students endpoint isn't implemented; require a manual fetch
        const r = await fetch(`/api/students?id=${id}`);
        data = (await r.json()).data?.[0];
      } else {
        data = (await res.json()).data;
      }
      setForm(data);
    })();
  },[id]);

  async function submit(e: React.FormEvent){
    e.preventDefault(); setSaving(true); setMsg('');
    try{
      const res = await fetch(`/api/students/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
      const j = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      router.push(`/students/${id}`);
    } catch(e:any){ setMsg(e.message || String(e)); } finally { setSaving(false); }
  }

  if (!form) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Edit Student</h2>
      <form onSubmit={submit} className="card space-y-3 max-w-xl">
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Legacy ID / Slug" value={form.slug||''} onChange={e=>setForm({...form, slug:e.target.value})} />
          <input className="input" placeholder="Grade" value={form.grade||''} onChange={e=>setForm({...form, grade:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="First name" value={form.first_name||''} onChange={e=>setForm({...form, first_name:e.target.value})} required />
          <input className="input" placeholder="Last name" value={form.last_name||''} onChange={e=>setForm({...form, last_name:e.target.value})} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="select" value={form.group_name||''} onChange={e=>setForm({...form, group_name:e.target.value})}>
            {['toddlers','beginners','primary','juniors','teens','telugu kids'].map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
          <input className="input" placeholder="Photo URL" value={form.photo_url||''} onChange={e=>setForm({...form, photo_url:e.target.value})} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="Guardian Name" value={form.guardian_name||''} onChange={e=>setForm({...form, guardian_name:e.target.value})} />
          <input className="input" placeholder="Guardian Phone" value={form.guardian_phone||''} onChange={e=>setForm({...form, guardian_phone:e.target.value})} />
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving?'Saving…':'Save'}</button>
          {msg && <div className="text-sm opacity-70">{msg}</div>}
        </div>
      </form>
    </div>
  );
} 