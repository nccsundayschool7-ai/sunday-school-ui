import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: NextRequest, { params }: { params: { id: string }}){
	const id = params.id;
	const isUuid = /^[0-9a-fA-F-]{36}$/.test(id);
	const sel = isUuid ? 'id.eq.'+id : 'slug.eq.'+id;
	const { data, error } = await supabaseAdmin.from('students').select('*').or(sel).limit(1).maybeSingle();
	if (error || !data) return NextResponse.json({ error: error?.message || 'NOT_FOUND' }, { status: 404 });
	return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string }}) {
	try{
		const body = await req.json();
		const id = params.id;
		const { error } = await supabaseAdmin.from('students').update(body).eq('id', id);
		if (error) return NextResponse.json({ error: error.message }, { status: 500 });
		return NextResponse.json({ ok:true });
	} catch(e:any){
		return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
	}
} 