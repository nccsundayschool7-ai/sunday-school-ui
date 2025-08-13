'use client';
import { useEffect, useState } from "react";
import students from "@/data/students.json";
import leaders from "@/data/leaders.json";
import { getWeekStart, toISO } from "@/lib/dates";

type Group = 'toddlers'|'beginners'|'primary'|'juniors'|'teens'|'telugu kids';

export default function Dashboard() {
  const [week, setWeek] = useState<string>("");
  const [totals, setTotals] = useState({ attended: 0, absentees: 0, newPeople: 5 });
  const [byGroup, setByGroup] = useState<any[]>([]);

  useEffect(()=>{
    const ws = toISO(getWeekStart(new Date()));
    setWeek(ws);
    // Mock stats:
    const total = students.length;
    const attended = Math.floor(total * 0.78);
    const absentees = total - attended;
    setTotals({ attended, absentees, newPeople: 7 });
    const groups: Record<Group,{present:number,absent:number}> = {
      'toddlers':{present:0,absent:0},
      'beginners':{present:0,absent:0},
      'primary':{present:0,absent:0},
      'juniors':{present:0,absent:0},
      'teens':{present:0,absent:0},
      'telugu kids':{present:0,absent:0}
    };
    students.forEach((s,i)=>{
      const present = i % 5 !== 0; // mock: 80% present
      if (present) groups[s.group].present++; else groups[s.group].absent++;
    });
    setByGroup(Object.entries(groups).map(([group,v]:any)=> ({
      group, ...v,
      pct: Math.round((v.present/(v.present+v.absent))*100)
    })));
  },[]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dashboard — Week of {week}</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="kpi"><div className="title">Attended</div><div className="value">{totals.attended}</div></div>
        <div className="kpi"><div className="title">Absentees</div><div className="value">{totals.absentees}</div></div>
        <div className="kpi"><div className="title">New Joiners</div><div className="value">{totals.newPeople}</div></div>
      </div>

      <section className="card">
        <h3 className="font-semibold mb-3">Group Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Group</th><th>Present</th><th>Absent</th><th>%</th></tr></thead>
            <tbody>
              {byGroup.map(g=> (
                <tr key={g.group}>
                  <td>{g.group}</td><td>{g.present}</td><td>{g.absent}</td><td>{g.pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3 className="font-semibold mb-3">Absentees (Tap to view contacts)</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {students.filter((_,i)=> i%5===0).slice(0,9).map(s=>(
            <div key={s.id} className="p-3 border rounded-md dark:border-gray-700">
              <div className="font-medium">{s.first_name} {s.last_name}</div>
              <div className="text-xs opacity-70">{s.group} • Grade {s.grade}</div>
              <div className="mt-2 text-sm">Parents: {s.mother_name} ({s.mother_phone}) / {s.father_name} ({s.father_phone})</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}