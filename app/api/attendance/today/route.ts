import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(){
	const today = new Date().toISOString().slice(0,10);
	// Try enriched view first (requires DB view v_attendance_students)
	let { data, error } = await supabaseAdmin
		.from('v_attendance_students')
		.select('person_id,slug,first_name,last_name,status')
		.eq('date', today);
	if (error) {
		// Fallback to raw attendance if view is missing
		const fb = await supabaseAdmin
			.from('attendance').select('person_id,status').eq('date', today).eq('type','student');
		if (fb.error) return NextResponse.json({ error: fb.error.message }, { status: 500 });
		return NextResponse.json({ data: fb.data });
	}
	return NextResponse.json({ data });
} 