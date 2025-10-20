import { toast } from "sonner";
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

        toast.error("Error signing in");
        throw new Error("Error signing in");
    }

    // Working
    public static async signUp(request: SignUpRequest) {
        const response = await signUpAction(request);

        if (response.status === 201) {
            const user = await AuthController.signIn(request);
            return user;
        }

        toast.error("Error signing up");
        throw new Error("Error signing up");
    }

    public static async validateToken(): Promise<boolean> {
        const isValid = await validateTokenAction();
        return isValid;
    }

    public static async getAuthToken(): Promise<string> {
        const authTokens = await getAuthTokenAction();
        console.log("tokens", authTokens);
        return authTokens.token;
    }

    // TODO: Validate signInWithGoogle
    public static async signInWithGoogle() {
        window.location.href = `${ENV.SERVICES.IAM.BASE_URL}/login/oauth2/authorization/google`;
    }

    // TODO: Validate signInWithGoogle
    public static async signInWithGithub() {
        window.location.href = `${ENV.SERVICES.IAM.BASE_URL}/login/oauth2/authorization/github`;
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
