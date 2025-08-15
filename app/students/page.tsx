'use client';
import Link from "next/link";
import { useEffect, useMemo, useState } from 'react';
import { fetchStudents } from '@/lib/data';

function Avatar({name, src}:{name:string;src?:string}){
  if (src) return <img src={src} alt="" className="w-full h-40 object-cover rounded-md" />;
  const initials = name.split(' ').map(p=>p[0]).slice(0,2).join('').toUpperCase();
  return <div className="w-full h-40 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-semibold">{initials}</div>;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [q, setQ] = useState('');
  useEffect(()=>{ fetchStudents().then(setStudents); },[]);

  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase();
    if (!term) return students;
    return students.filter(s=>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(term) ||
      (s.slug || '').toLowerCase().includes(term)
    );
  },[q, students]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-xl font-semibold">Students</h2>
        <input className="input max-w-xs" placeholder="Search name or slug…" value={q} onChange={e=>setQ(e.target.value)} />
        <Link href="/students/new" className="btn btn-primary">Add New</Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(s => (
          <Link href={`/students/${s.id}`} key={s.id} className="card hover:shadow-lg transition">
            <Avatar name={`${s.first_name} ${s.last_name}`} src={s.photo_url} />
            <div className="mt-2 font-medium">{s.first_name} {s.last_name}</div>
            <div className="text-xs opacity-70">{(s as any).group ?? s.group_name} • Grade {s.grade}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}