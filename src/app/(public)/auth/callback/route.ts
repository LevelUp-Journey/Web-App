import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { CONSTS } from "@/lib/consts";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken") || "";
    const error = searchParams.get("error");

    if (error) {
        redirect("/en/auth/sign-in?error=" + encodeURIComponent(error));
    }

    if (token) {
        const cookieStore = await cookies();
        cookieStore.set(CONSTS.AUTH_TOKEN_KEY, token);
        if (refreshToken) {
            cookieStore.set(CONSTS.AUTH_REFRESH_TOKEN_KEY, refreshToken);
        }
        redirect("/en/dashboard");
    } else {
        redirect("/en/auth/sign-in");
    }
}
