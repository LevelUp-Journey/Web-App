import { CONSTS } from "@/lib/consts";

export class AuthTokenHandler {
    public static saveToken(token: string) {
        localStorage.setItem(CONSTS.AUTH_TOKEN_KEY, token);
    }

    public static getToken(): string | null {
        return localStorage.getItem(CONSTS.AUTH_TOKEN_KEY);
    }
}
