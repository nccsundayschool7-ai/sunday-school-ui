import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest) {
	try{
		const body = await req.json();
		const payload = {
			slug: body.slug || body.id || undefined,
			first_name: body.first_name,
			last_name: body.last_name,
			group_name: body.group_name,
			grade: body.grade,
			photo_url: body.photo_url || null,
			guardian_name: body.guardian_name || null,
			guardian_phone: body.guardian_phone || null,
			mother_name: body.mother_name || null,
			mother_phone: body.mother_phone || null,
			father_name: body.father_name || null,
			father_phone: body.father_phone || null,
			notes: body.notes || null
		};
		const { data, error } = await supabaseAdmin.from('students').insert([payload]).select('id').single();
		if (error) return NextResponse.json({ error: error.message }, { status: 500 });
		return NextResponse.json({ ok:true, id: data.id });
	} catch(e:any){
		return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
	}
} 