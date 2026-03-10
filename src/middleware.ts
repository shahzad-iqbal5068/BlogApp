import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });
  const session = token
    ? { user: { role: token.role as string } }
    : null;
  const { pathname } = req.nextUrl;

  const protectedPaths = ["/dashboard", "/blog/new", "/blog/edit"];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    const login = new URL("/login", req.url);
    login.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(login);
  }

  const adminPaths = ["/admin"];
  const isAdminPath = adminPaths.some((p) => pathname.startsWith(p));
  const role = session?.user?.role;

  if (isAdminPath && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.json).*)"],
};
