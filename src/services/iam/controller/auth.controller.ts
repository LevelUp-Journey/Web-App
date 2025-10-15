import { redirect } from "next/navigation";
import { toast } from "sonner";
import { ENV } from "@/lib/env";
import { PATHS } from "@/lib/paths";
import {
    saveAuthToken,
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
        console.log("Sign in response", response)
        if (response.status === 200) {
            const data = response.data as SignInResponse;
            saveAuthToken(data.token);
            redirect(PATHS.DASHBOARD.ROOT);
        }

        console.log(response);
        toast.error("Error signing in");
    }

    // Working
    public static async signUp(request: SignUpRequest) {
        const response = await signUpAction(request);

        console.log("Sign up response", response)

        if (response.status === 201) {
            AuthController.signIn(request);
        }

        console.log(response);
        toast.error("Error signing up");
    }

    public static async validateToken(): Promise<boolean> {
        const isValid = await validateTokenAction();
        return isValid;
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
        signOutAction();
    }
}
