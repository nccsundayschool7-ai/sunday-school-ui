import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export function createSupabaseServerClient() {
	const cookieStore = cookies();
	return createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL as string,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value;
				},
				set(name: string, value: string, options: CookieOptions) {
					cookieStore.set(name, value, options);
				},
				remove(name: string, options: CookieOptions) {
					cookieStore.set(name, '', { ...options, maxAge: 0 });
				},
			},
		}
	);
} 