'use client';
import students from "@/data/students.json";
import { useState } from "react";

export default function AttendancePage(){
  const [present, setPresent] = useState<Record<string, boolean>>({});
  const groups = ['toddlers','beginners','primary','juniors','teens','telugu kids'];
  const [group, setGroup] = useState(groups[0]);

  const filtered = students.filter(s => s.group === group);
  const presentCount = Object.values(present).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Attendance (Preview)</h2>
        <select className="select" value={group} onChange={e=>setGroup(e.target.value)}>
          {groups.map(g=> <option key={g} value={g}>{g}</option>)}
        </select>
        <div className="ml-auto badge">Marked Present: {presentCount}</div>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(s=>(
          <button key={s.id} className={"card text-left " + (present[s.id] ? "ring-2 ring-green-500" : "")}
            onClick={()=> setPresent(p => ({...p, [s.id]: !p[s.id]}))}>
            <img src={s.photo_url || "/logo.png"} className="w-full h-36 object-cover rounded" />
            <div className="mt-2 font-medium">{s.first_name} {s.last_name}</div>
            <div className="text-xs opacity-70">{s.group} • Grade {s.grade}</div>
          </button>
        ))}
      </div>
    </div>
  )
}