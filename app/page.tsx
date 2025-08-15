'use client';
import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import { fetchStudents, fetchAttendanceRange, getWeekRange } from "@/lib/data";
import { getWeekStart } from "@/lib/dates";
import { SundayDatePicker } from './components/SundayDatePicker';

type Group = 'toddlers'|'beginners'|'primary'|'juniors'|'teens'|'telugu kids';

type Student = any;

type WeekOpt = { label: string; from: string; to: string };

type GroupStats = {
  group: Group;
  present: number;
  absent: number;
  pct: number;
  newCount: number;
  presentStudents: Student[];
  absentStudents: Student[];
  newStudents: Student[];
};

export default function Dashboard() {
  const [week, setWeek] = useState<WeekOpt | null>(null);
  const [weekOptions, setWeekOptions] = useState<WeekOpt[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<Partial<Record<Group, boolean>>>({});
  const [focusList, setFocusList] = useState<Partial<Record<Group, 'absent'|'present'|'new'|undefined>>>({});

  // Build last 12 weeks options (Sundays)
  useEffect(()=>{
    const start = getWeekStart(new Date());
    const opts: WeekOpt[] = Array.from({length: 12}).map((_,i)=>{
      const d = new Date(start);
      d.setDate(d.getDate() - 7*i);
      const { from, to } = getWeekRange(d);
      return { label: `${from} → ${to}`, from, to };
    });
    setWeekOptions(opts);
    setWeek(opts[0]);
    fetchStudents().then(setStudents);
  },[]);

  // Fetch attendance covering the selected week and previous 3 weeks (for 100% calc)
  useEffect(()=>{
    if (!week) return;
    (async()=>{
      const curStart = new Date(week.from);
      const oldest = new Date(curStart);
      oldest.setDate(oldest.getDate() - 7*3);
      const { from: rangeFrom } = getWeekRange(oldest);
      const rangeTo = week.to;
      const data = await fetchAttendanceRange(rangeFrom, rangeTo);
      setAttendance(data);
    })();
  },[week]);

  const groupStats = useMemo<GroupStats[]>(()=>{
    if (!week) return [] as GroupStats[];
    const presentIds = new Set(attendance.filter(a=> a.type==='student' && a.status==='present' && a.date >= week.from && a.date <= week.to).map(a=> a.person_id));
    const countedIds = new Set(attendance.filter(a=> a.type==='student' && a.status!=='excused' && a.date >= week.from && a.date <= week.to).map(a=> a.person_id));
    const groupsInit: Record<Group,GroupStats> = {
      'toddlers':   init('toddlers'),
      'beginners':  init('beginners'),
      'primary':    init('primary'),
      'juniors':    init('juniors'),
      'teens':      init('teens'),
      'telugu kids':init('telugu kids'),
    };
    function init(g: Group): GroupStats {
      return { group: g, present: 0, absent: 0, pct: 0, newCount: 0, presentStudents: [], absentStudents: [], newStudents: [] };
    }
    students.forEach(s=>{
      const g = ((s as any).group ?? s.group_name) as Group;
      if (!g || !(g in groupsInit)) return;
      const isPresent = presentIds.has(s.id);
      const isCounted = countedIds.has(s.id);
      if (isCounted) {
        if (isPresent) { groupsInit[g].present++; groupsInit[g].presentStudents.push(s); }
        else { groupsInit[g].absent++; groupsInit[g].absentStudents.push(s); }
      }
      if (s.inserted_at && s.inserted_at >= week.from && s.inserted_at <= week.to) {
        groupsInit[g].newCount++; groupsInit[g].newStudents.push(s);
      }
    });
    const arr = Object.values(groupsInit).map(gs=> ({
      ...gs,
      pct: (gs.present+gs.absent) ? Math.round(gs.present*100/(gs.present+gs.absent)) : 0
    }));
    return arr;
  },[students, attendance, week]);

  // Compute 100% attendance over last 4 Sundays
  const perfect4Weeks = useMemo<Student[]>(()=>{
    if (!week) return [];
    const curStart = getWeekStart(new Date(week.from));
    const weekStarts: string[] = Array.from({length:4}).map((_,i)=>{
      const d = new Date(curStart); d.setDate(d.getDate() - 7*i);
      return d.toISOString().slice(0,10);
    });
    const attByWeekByStudent = new Map<string, Set<string>>(); // studentId -> set of weekStart ISO
    for (const a of attendance.filter(a=> a.type==='student' && a.status==='present')){
      const d = new Date(a.date); const ws = getWeekStart(d).toISOString().slice(0,10);
      if (!weekStarts.includes(ws)) continue;
      if (!attByWeekByStudent.has(a.person_id)) attByWeekByStudent.set(a.person_id, new Set<string>());
      attByWeekByStudent.get(a.person_id)!.add(ws);
    }
    const result: Student[] = [];
    for (const s of students){
      const set = attByWeekByStudent.get(s.id);
      if (set && weekStarts.every(ws=> set.has(ws))) result.push(s);
    }
    return result;
  },[attendance, students, week]);

  function exportCSV() {
    const rows = [
      ['Group','Present','Absent','%','New this week'],
      ...groupStats.map(g=> [g.group, String(g.present), String(g.absent), String(g.pct), String(g.newCount)])
    ];
    const csv = rows.map(r=> r.map(cell=>
      /[,"]/.test(String(cell)) ? '"'+String(cell).replaceAll('"','""')+'"' : String(cell)
    ).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `attendance_summary_${week?.from}_${week?.to}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Weekly Attendance Overview</h2>
        {week ? (
          <SundayDatePicker
            valueISO={week.from}
            onChange={(iso)=> {
              const { from, to } = getWeekRange(new Date(iso));
              setWeek({ label: `${from} → ${to}`, from, to });
            }}
          />
        ) : null}
        <button className="btn" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {groupStats.map(g=> (
          <div key={g.group} className="card">
            <div className="flex items-center gap-3">
              <div className="font-semibold capitalize">{g.group}</div>
              <div className="ml-auto flex items-center gap-2 text-sm">
                <button className="badge" onClick={()=> { setExpanded(e=> ({...e, [g.group]: true })); setFocusList(f=> ({...f, [g.group]:'present'})); }}>Present {g.present}</button>
                <button className="badge" onClick={()=> { setExpanded(e=> ({...e, [g.group]: true })); setFocusList(f=> ({...f, [g.group]:'absent'})); }}>Absent {g.absent}</button>
                <span className="badge">{g.pct}%</span>
                <button className="badge" onClick={()=> { setExpanded(e=> ({...e, [g.group]: true })); setFocusList(f=> ({...f, [g.group]:'new'})); }}>New {g.newCount}</button>
              </div>
            </div>
            <div className="mt-3 h-2 w-full bg-gray-200 dark:bg-gray-800 rounded">
              <div className="h-2 bg-green-500 rounded" style={{ width: `${g.pct}%` }} />
            </div>
            <div className="mt-3 flex gap-2 text-sm">
              <button className="btn btn-ghost" onClick={()=> setExpanded(e=> ({...e, [g.group]: e[g.group] ? false : true }))}>
                {expanded[g.group] ? 'Hide details' : 'View details'}
              </button>
            </div>
            {expanded[g.group] ? (
              <div className="mt-3 grid sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <div className={`label ${focusList[g.group]==='absent' ? 'font-semibold' : ''}`}>Absentees</div>
                  <div className="space-y-1 max-h-56 overflow-auto">
                    {g.absentStudents.length ? g.absentStudents.map((s)=> (
                      <div key={s.id} className="flex items-center justify-between">
                        <Link href={`/students/${s.id}`} className="underline hover:no-underline">{s.first_name} {s.last_name}</Link>
                        <span className="opacity-60">{(s as any).group ?? s.group_name}</span>
                      </div>
                    )) : <div className="opacity-60">None</div>}
                  </div>
                </div>
                <div>
                  <div className={`label ${focusList[g.group]==='present' ? 'font-semibold' : ''}`}>Present</div>
                  <div className="space-y-1 max-h-56 overflow-auto">
                    {g.presentStudents.length ? g.presentStudents.map((s)=> (
                      <div key={s.id} className="flex items-center justify-between">
                        <Link href={`/students/${s.id}`} className="underline hover:no-underline">{s.first_name} {s.last_name}</Link>
                        <span className="opacity-60">{(s as any).group ?? s.group_name}</span>
                      </div>
                    )) : <div className="opacity-60">None</div>}
                  </div>
                </div>
                <div>
                  <div className={`label ${focusList[g.group]==='new' ? 'font-semibold' : ''}`}>New this week</div>
                  <div className="space-y-1 max-h-56 overflow-auto">
                    {g.newStudents.length ? g.newStudents.map((s)=> (
                      <div key={s.id} className="flex items-center justify-between">
                        <Link href={`/students/${s.id}`} className="underline hover:no-underline">{s.first_name} {s.last_name}</Link>
                        <span className="opacity-60">{(s as any).group ?? s.group_name}</span>
                      </div>
                    )) : <div className="opacity-60">None</div>}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">100% attendance (last 4 Sundays)</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {perfect4Weeks.map(s=> (
            <Link key={s.id} href={`/students/${s.id}`} className="p-3 border rounded-md dark:border-gray-700 hover:shadow">
              <div className="font-medium">{s.first_name} {s.last_name}</div>
              <div className="text-xs opacity-70">{(s as any).group ?? s.group_name} • Grade {s.grade}</div>
            </Link>
          ))}
          {!perfect4Weeks.length && <div className="opacity-60 text-sm">No students with 4/4 attendance.</div>}
        </div>
      </div>
    </div>
  );
}