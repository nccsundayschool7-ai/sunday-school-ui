'use client';
import { useParams } from "next/navigation";
import students from "@/data/students.json";

export default function StudentDetail() {
  const params = useParams(); // { id }
  const student = students.find(s => s.id === params?.id) || students[0];
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card">
        <img src={student.photo_url || "/logo.png"} className="w-full h-64 object-cover rounded" />
        <div className="mt-3">
          <div className="text-xl font-semibold">{student.first_name} {student.last_name}</div>
          <div className="text-sm opacity-70">Group: {student.group} • Grade {student.grade}</div>
        </div>
      </div>
      <div className="card md:col-span-2">
        <h3 className="font-semibold mb-3">Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Field label="Age" value={student.age} />
          <Field label="Birthday" value={student.birthday} />
          <Field label="Mother" value={`${student.mother_name} (${student.mother_phone})`} />
          <Field label="Father" value={`${student.father_name} (${student.father_phone})`} />
          <Field label="Area" value={student.area} />
          <Field label="School" value={student.school} />
          <Field label="Baptism" value={student.baptism ? "Yes":"No"} />
          <Field label="Holy Spirit" value={student.holy_spirit ? "Yes":"No"} />
          <Field label="Special Talents" value={student.special_talents || "-"} />
          <Field label="Teacher" value={student.teacher} />
          <Field label="Assistant Teacher" value={student.assistant_teacher} />
          <Field label="QR ID" value={student.qr_code} />
        </div>
      </div>
    </div>
  );
}

function Field({label, value}:{label:string;value:any}){
  return <div><div className="label">{label}</div><div className="font-medium">{String(value)}</div></div>;
}