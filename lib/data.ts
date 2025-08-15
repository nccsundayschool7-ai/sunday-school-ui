import { supabase } from './supabase';
import studentsJson from '@/data/students.json';
import leadersJson from '@/data/leaders.json';

export type LeaderRole = 'teacher'|'assistant_teacher'|'support_staff';

export interface LeaderRow {
	id: string;
	first_name: string;
	last_name: string;
	role: LeaderRole;
	phone?: string;
	email?: string;
	photo_url?: string;
	assigned_groups?: string[];
	notes?: string;
}

export interface StudentRow {
	id: string;
	slug?: string;
	first_name: string;
	last_name: string;
	group_name?: string; // maps from JSON 'group'
	grade?: string;
	photo_url?: string;
	teacher_id?: string;
	assistant_teacher_id?: string;
	guardian_name?: string;
	guardian_phone?: string;
	mother_name?: string;
	mother_phone?: string;
	father_name?: string;
	father_phone?: string;
	notes?: string;
	// legacy JSON fields kept for UI mapping
	group?: string;
	inserted_at?: string;
}

export interface AttendanceRow {
	id?: string;
	date: string; // YYYY-MM-DD
	person_id: string;
	type: 'student'|'leader';
	status: 'present'|'absent'|'late'|'excused';
	remarks?: string|null;
}

const usingSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function fetchStudents(): Promise<StudentRow[]> {
	if (!usingSupabase) return studentsJson as unknown as StudentRow[];
	const { data, error } = await supabase.from('students').select('*').order('first_name');
	if (error) {
		console.warn('Supabase students error, falling back to JSON:', error.message);
		return studentsJson as unknown as StudentRow[];
	}
	return data as StudentRow[];
}

export async function fetchStudentById(id: string): Promise<StudentRow | undefined> {
	if (!usingSupabase) {
		const list = studentsJson as unknown as StudentRow[];
		return list.find(s => s.id === id || s.slug === id);
	}
	const { data, error } = await supabase.from('students').select('*').or(`id.eq.${id},slug.eq.${id}`).limit(1).maybeSingle();
	if (error) {
		console.warn('Supabase student by id error:', error.message);
		const list = studentsJson as unknown as StudentRow[];
		return list.find(s => s.id === id || s.slug === id);
	}
	return data as StudentRow | undefined;
}

export async function fetchLeaders(): Promise<LeaderRow[]> {
	if (!usingSupabase) return leadersJson as unknown as LeaderRow[];
	const { data, error } = await supabase.from('leaders').select('*').order('first_name');
	if (error) {
		console.warn('Supabase leaders error, falling back to JSON:', error.message);
		return leadersJson as unknown as LeaderRow[];
	}
	return data as LeaderRow[];
}

export async function fetchAttendanceRange(from: string, to: string): Promise<AttendanceRow[]> {
	if (!usingSupabase) return [];
	const { data, error } = await supabase.from('attendance').select('*').gte('date', from).lte('date', to);
	if (error) { console.warn('Attendance fetch error', error.message); return []; }
	return data as AttendanceRow[];
}

export function getWeekRange(date: Date): { from: string; to: string } {
	const d = new Date(date);
	const day = d.getDay();
	d.setHours(0,0,0,0);
	d.setDate(d.getDate() - day);
	const from = d.toISOString().slice(0,10);
	const toDate = new Date(d);
	toDate.setDate(toDate.getDate()+6);
	const to = toDate.toISOString().slice(0,10);
	return { from, to };
} 