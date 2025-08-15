import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const code = process.argv[2] || 'S001';

(async()=>{
	const supabase = createClient(url, key);
	const { data, error } = await supabase.from('students').select('id,slug,first_name,last_name').or(`id.eq.${code},slug.eq.${code}`).limit(1).maybeSingle();
	if (error) throw error;
	console.log('Found:', data);
})().catch(e=>{ console.error(e); process.exit(1); }); 