'use client';
import leaders from "@/data/leaders.json";

export default function LeadersPage(){
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Sunday School Leaders</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {leaders.map(l=>(
          <div key={l.id} className="card">
            <img src={l.photo_url || "/logo.png"} alt="" className="w-full h-40 object-cover rounded" />
            <div className="mt-2 font-medium">{l.first_name} {l.last_name}</div>
            <div className="text-xs opacity-70 capitalize">{l.role}</div>
            <div className="text-sm mt-2">Phone: {l.phone}</div>
            <div className="text-sm">Email: {l.email}</div>
            <div className="text-xs opacity-70 mt-1">Groups: {l.assigned_groups.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  )
}