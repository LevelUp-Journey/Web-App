import { redirect } from "next/navigation";
import { toast } from "sonner";
import { ENV } from "@/lib/env";
import { PATHS } from "@/lib/paths";
import {
    saveAuthToken,
    signInAction,
    signUpAction,
    validateTokenAction,
} from "../server/auth.actions";
import type { SignInRequest, SignUpRequest } from "./auth.response";

export class AuthController {
    // Working
    public static async signIn(request: SignInRequest) {
        try {
            const response = await signInAction(request);

            saveAuthToken(response.data.token);

            redirect(PATHS.DASHBOARD.ROOT);
        } catch {
            toast.error("Failed to sign in");
        }
    }

    // Working
    public static async signUp(request: SignUpRequest) {
        await signUpAction(request);
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
}
