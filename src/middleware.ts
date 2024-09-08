import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/utils/lib/session";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await getSession();

  const expire = new Date(session.expires!);

  const date = new Date();

  const checkExpire = expire < date;

  const rolePath: any = {
    A: "/admin/", // Admin
    U: "/user/", // User
    K: "/kasat/", // Kasat
    O: "/operator/", // Operator
    KB: "/kepala-bidang/",
  };

  const rolePaths = Object.values(rolePath);

  const startsWithRolePath = rolePaths.some((rp: any) => path.startsWith(rp));

  if (!session.isLoggedIn && startsWithRolePath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if ((session.expires == null || checkExpire) && startsWithRolePath) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (path == "/" && session.isLoggedIn && !checkExpire) {
    return NextResponse.redirect(
      new URL(`${rolePath[session.role!]}dashboard`, request.url)
    );
  }

  const userRolePath = rolePath[session.role!];

  if (
    session.isLoggedIn &&
    !checkExpire &&
    startsWithRolePath &&
    !path.startsWith(userRolePath)
  ) {
    return NextResponse.redirect(
      new URL(`${userRolePath}dashboard`, request.url)
    );
  }

  return NextResponse.next();
}
