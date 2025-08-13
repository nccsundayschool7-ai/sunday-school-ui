'use client';
import Link from "next/link";
import students from "@/data/students.json";

export default function StudentsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Students</h2>
        <Link href="/students/new" className="btn btn-primary">Add New</Link>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {students.map(s => (
          <Link href={`/students/${s.id}`} key={s.id} className="card hover:shadow-lg transition">
            <img src={s.photo_url || "/logo.png"} alt="" className="w-full h-40 object-cover rounded-md" />
            <div className="mt-2 font-medium">{s.first_name} {s.last_name}</div>
            <div className="text-xs opacity-70">{s.group} • Grade {s.grade}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}