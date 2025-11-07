import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { CONSTS } from "@/lib/consts";
import { PATHS } from "@/lib/paths";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken") || "";
    const error = searchParams.get("error");

    if (error) {
        redirect(`/${PATHS.AUTH.SIGN_IN}?error=${encodeURIComponent(error)}`);
    }

    if (token) {
        const cookieStore = await cookies();
        cookieStore.set(CONSTS.AUTH_TOKEN_KEY, token);
        if (refreshToken) {
            cookieStore.set(CONSTS.AUTH_REFRESH_TOKEN_KEY, refreshToken);
        }
        redirect(PATHS.DASHBOARD.ROOT);
    } else {
        redirect(PATHS.AUTH.SIGN_IN);
    }
}
