import { NextResponse, type NextRequest } from "next/server";
import { decrypt, SESSION_COOKIE } from "@/lib/session";

const AUTH_PAGES = ["/login", "/signup"];
const PUBLIC_PAGES = ["/", ...AUTH_PAGES];

// 只做「看 cookie」的快速檢查；真正的權限檢查在 API 與資料存取層
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await decrypt(request.cookies.get(SESSION_COOKIE)?.value);

  if (!session && !PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
  if (session && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/review", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  // 排除 API、Next 內部檔案與靜態檔
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
