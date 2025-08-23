import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create a response object to modify cookies if needed
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  // Initialize Supabase client with edge-compatible cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll(); // Read cookies from incoming request
        },
        setAll(cookiesToSet) {
          // Set cookies on the outgoing response
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Access the session (this will refresh if expired)
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    // Handle errors, e.g., log or redirect
    console.error('Session error:', error);
    return NextResponse.redirect(new URL('/register', request.url));
  }

  // Use the session for logic, e.g., protect routes
  if (request.nextUrl.pathname.startsWith('/main') && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If session exists, you can access details like user ID
  const userId = session?.user?.id;

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
