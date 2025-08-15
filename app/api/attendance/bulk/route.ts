import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(req: NextRequest){
	try{
		const { rows } = await req.json();
		if (!Array.isArray(rows)) return NextResponse.json({ error: 'rows required' }, { status: 400 });
		const { error } = await supabaseAdmin.from('attendance').upsert(rows, { onConflict: 'date,person_id' });
		if (error) return NextResponse.json({ error: error.message }, { status: 500 });
		return NextResponse.json({ ok: true });
	} catch(e:any){
		return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
	}
} 