'use client';
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { fetchStudentById } from '@/lib/data';
import QRCode from 'qrcode';
import Link from 'next/link';

export default function StudentDetail() {
  const params = useParams(); // { id }
  const [student, setStudent] = useState<any | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");

  useEffect(()=>{
    const id = String((params as any)?.id);
    fetchStudentById(id).then(async s => {
      setStudent(s || null);
      if (s) {
        const payload = s.slug || s.id;
        try{ setQrDataUrl(await QRCode.toDataURL(String(payload), { width: 240 })); } catch{}
      }
    });
  },[params]);

  if (!student) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{student.first_name} {student.last_name}</h2>
        <Link href={("/students/" + student.id + "/edit") as any} className="btn btn-primary">Edit</Link>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <img src={student.photo_url || "/logo.png"} className="w-full h-64 object-cover rounded" />
          <div className="mt-3">
            <div className="text-sm opacity-70">Group: {(student as any).group ?? student.group_name} • Grade {student.grade}</div>
          </div>
          {qrDataUrl ? (
            <div className="mt-4">
              <div className="label">QR Code</div>
              <img src={qrDataUrl} alt="QR" className="w-40 h-40" />
              <div className="text-xs opacity-70">Scannable ID: {student.slug || student.id}</div>
            </div>
          ) : null}
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
    </div>
  );
}

function Field({label, value}:{label:string;value:any}){
  return <div><div className="label">{label}</div><div className="font-medium">{String(value)}</div></div>;
}