'use client';
import { useEffect, useState } from "react";
import { fetchStudents } from "@/lib/data";

function Avatar({name, src}:{name:string;src?:string}){
  if (src) return <img src={src} className="w-full h-36 object-cover rounded" />;
  const initials = name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
  return <div className="w-full h-36 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl font-semibold">{initials}</div>;
}

async function fetchTodayPresent(): Promise<Record<string, boolean>>{
  const res = await fetch('/api/attendance/today', { cache: 'no-store' });
  if (!res.ok) return {};
  const j = await res.json();
  const map: Record<string, boolean> = {};
  for (const r of j.data || []) if (r.status === 'present') map[r.person_id] = true;
  return map;
}

export default function AttendancePage(){
  const [students, setStudents] = useState<any[]>([]);
  const [present, setPresent] = useState<Record<string, boolean>>({});
  const groups = ['toddlers','beginners','primary','juniors','teens','telugu kids'];
  const [group, setGroup] = useState(groups[0]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>("");

  useEffect(()=>{ fetchStudents().then(setStudents); },[]);
  useEffect(()=>{ fetchTodayPresent().then(setPresent); },[]);

  useEffect(()=>{
    let timer: any;
    const onStorage = () => {
      if (localStorage.getItem('attendance_marked') === '1'){
        fetchTodayPresent().then(setPresent);
        localStorage.removeItem('attendance_marked');
      }
    };
    window.addEventListener('storage', onStorage);
    return ()=> { window.removeEventListener('storage', onStorage); if (timer) clearTimeout(timer); };
  },[]);

  const filtered = students.filter(s => (s as any).group === group || s.group_name === group);
  const presentCount = Object.values(present).filter(Boolean).length;

  const markAll = (value: boolean) => {
    const next: Record<string, boolean> = {};
    filtered.forEach(s => { next[s.id] = value; });
    setPresent(next);
  };

  const saveAttendance = async () => {
    setSaving(true); setMessage("");
    try {
      const today = new Date().toISOString().slice(0,10);
      const rows = filtered.map(s => ({
        date: today,
        person_id: s.id,
        type: 'student' as const,
        status: present[s.id] ? 'present' as const : 'absent' as const,
        remarks: null as any
      }));
      const res = await fetch('/api/attendance/bulk', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ rows }) });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`);
      setMessage("Saved attendance.");
    } catch (e:any) {
      setMessage(`Error: ${e.message || e}`);
    } finally {
      setSaving(false);
      setTimeout(()=> setMessage(""), 3000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Attendance (Preview)</h2>
        <select className="select" value={group} onChange={e=>setGroup(e.target.value)}>
          {groups.map(g=> <option key={g} value={g}>{g}</option>)}
        </select>
        <button className="btn" onClick={()=> markAll(true)}>Mark all present</button>
        <button className="btn" onClick={()=> markAll(false)}>Clear all</button>
        <button className="btn btn-primary" onClick={saveAttendance} disabled={saving}>{saving ? 'Saving…' : 'Save to Supabase'}</button>
        <div className="ml-auto badge">Marked Present: {presentCount}</div>
      </div>
      {message ? <div className="text-sm opacity-80">{message}</div> : null}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(s=>(
          <button key={s.id} className={"card text-left transition " + (present[s.id] ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20" : "")}
            onClick={()=> setPresent(p => ({...p, [s.id]: !p[s.id]}))}>
            <Avatar name={`${s.first_name} ${s.last_name}`} src={s.photo_url} />
            <div className="mt-2 font-medium">{s.first_name} {s.last_name}</div>
            <div className="text-xs opacity-70">{(s as any).group ?? s.group_name} • Grade {s.grade}</div>
          </button>
        ))}
      </div>
    </div>
  )
}