'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NewLeaderPage(){
  const router = useRouter();
  const [form, setForm] = useState({ first_name:'', last_name:'', role:'teacher', phone:'', email:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setSaving(true); setMsg('');
    try{
      const { error } = await supabase.from('leaders').insert([{...form}]);
      if (error) throw error;
      setMsg('Created');
      router.push('/leaders');
    } catch(e:any){ setMsg(e.message || String(e)); }
    finally{ setSaving(false); }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Add Leader</h2>
      <form onSubmit={submit} className="card space-y-3 max-w-lg">
        <div className="grid grid-cols-2 gap-3">
          <input className="input" placeholder="First name" value={form.first_name} onChange={e=>setForm({...form, first_name:e.target.value})} required />
          <input className="input" placeholder="Last name" value={form.last_name} onChange={e=>setForm({...form, last_name:e.target.value})} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select className="select" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="teacher">Teacher</option>
            <option value="assistant_teacher">Assistant Teacher</option>
            <option value="support_staff">Support Staff</option>
          </select>
          <input className="input" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        </div>
        <input className="input" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <div className="flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving?'Saving…':'Save'}</button>
          {msg && <div className="text-sm opacity-70">{msg}</div>}
        </div>
      </form>
    </div>
  );
} 