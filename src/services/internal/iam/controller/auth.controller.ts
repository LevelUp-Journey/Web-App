import { ENV } from "@/lib/env";
import {
    getAuthTokenAction,
    getUserIdFromTokenAction,
    getUserRolesFromTokenAction,
    refreshTokenAction,
    saveAuthTokenAction,
    signInAction,
    signOutAction,
    signUpAction,
    validateTokenAction,
} from "../server/auth.actions";
import type {
    SignInRequest,
    SignInResponse,
    SignUpRequest,
} from "./auth.response";

export class AuthController {
    // Working
    public static async signIn(request: SignInRequest) {
        const response = await signInAction(request);
        if (response.status === 200) {
            const data = response.data as SignInResponse;
            await saveAuthTokenAction(data.token, data.refreshToken);
            return data;
        }

        throw new Error("Error signing in");
    }

    // Working
    public static async signUp(request: SignUpRequest) {
        const response = await signUpAction(request);

        if (response.status === 201) {
            const user = await AuthController.signIn(request);
            return user;
        }

        throw new Error("Error signing up");
    }

    public static async validateToken(): Promise<boolean> {
        const isValid = await validateTokenAction();
        return isValid;
    }

    public static async getAuthToken(): Promise<string> {
        const authTokens = await getAuthTokenAction();
        return authTokens.token;
    }

    public static async signInWithGoogle() {
        window.location.href = ENV.OAUTH.GOOGLE.AUTH_URL;
    }

    public static async signInWithGithub() {
        window.location.href = ENV.OAUTH.GITHUB.AUTH_URL;
    }

    public static async signOut() {
        // Delete user data from local storage
        localStorage.clear();
        signOutAction();
    }

    public static async getUserRoles() {
        const roles = await getUserRolesFromTokenAction();
        return roles;
    }

    public static async refreshToken() {
        const response = await refreshTokenAction();

        if (response.status === 200) {
            return await saveAuthTokenAction(
                response.data.accessToken,
                response.data.refreshToken,
            );
        }

        AuthController.signOut();
    }

    public static async getUserId() {
        const userId = await getUserIdFromTokenAction();
        return userId;
    }
}
