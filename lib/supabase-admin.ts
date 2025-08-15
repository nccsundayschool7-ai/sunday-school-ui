import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

if (!supabaseUrl || !serviceRoleKey) {
	console.warn('Supabase admin env vars missing');
}

export const supabaseAdmin = createClient(supabaseUrl || 'http://localhost', serviceRoleKey || 'service'); 