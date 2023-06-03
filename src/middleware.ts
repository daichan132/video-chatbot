import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

import type { Database } from '@/types/supabase';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const { pathname } = req.nextUrl;

  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session && pathname.startsWith('/c')) {
    const url = new URL(req.url);
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  if (session && (pathname === '/' || pathname === '/#')) {
    const url = new URL(req.url);
    url.pathname = '/c';
    return NextResponse.redirect(url);
  }

  return res;
}
