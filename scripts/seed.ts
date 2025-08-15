import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import students from '../data/students.json';
import leaders from '../data/leaders.json';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!url || !serviceRole) {
	console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
	process.exit(1);
}

const supabase = createClient(url, serviceRole);

async function main() {
	console.log('Seeding leaders...');
	const leadersRows = (leaders as any[]).map(l => ({
		first_name: l.first_name,
		last_name: l.last_name,
		role: l.role,
		phone: l.phone,
		email: l.email,
		photo_url: l.photo_url || null,
		notes: null
	}));
	let { error: le } = await supabase.from('leaders').insert(leadersRows);
	if (le && !String(le.message).includes('duplicate key')) throw le;

	console.log('Seeding students...');
	const studentsRows = (students as any[]).map(s => ({
		slug: s.id, // keep legacy id as slug
		first_name: s.first_name,
		last_name: s.last_name,
		group_name: s.group,
		grade: s.grade,
		photo_url: s.photo_url || null,
		guardian_name: s.mother_name || s.father_name || null,
		guardian_phone: s.mother_phone || s.father_phone || null,
		mother_name: s.mother_name || null,
		mother_phone: s.mother_phone || null,
		father_name: s.father_name || null,
		father_phone: s.father_phone || null,
		notes: null
	}));
	let { error: se } = await supabase.from('students').insert(studentsRows);
	if (se && !String(se.message).includes('duplicate key')) throw se;

	console.log('Done.');
}

main().catch(err => {
	console.error(err);
	process.exit(1);
}); 