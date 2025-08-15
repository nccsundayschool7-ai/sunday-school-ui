import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

function isUuidLike(s: string){
	return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(s);
}

export async function POST(req: NextRequest) {
	try{
		const { code } = await req.json();
		if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 });
		const text = String(code).trim();
		const isUuid = isUuidLike(text);
		const sel = isUuid ? 'id.eq.'+text : 'slug.eq.'+text;
		const { data: student, error } = await supabaseAdmin
			.from('students').select('id,slug').or(sel).limit(1).maybeSingle();
		if (error || !student) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
		const today = new Date().toISOString().slice(0,10);
		const { data: existing, error: existErr } = await supabaseAdmin
			.from('attendance').select('id').eq('date', today).eq('person_id', student.id).limit(1).maybeSingle();
		if (!existErr && existing) return NextResponse.json({ ok: true, already: true });
		const { error: upErr } = await supabaseAdmin
			.from('attendance')
			.upsert([{ date: today, person_id: student.id, type: 'student', status: 'present' }], { onConflict: 'date,person_id' });
		if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });
		return NextResponse.json({ ok: true });
	} catch(e:any){
		return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
	}
} 