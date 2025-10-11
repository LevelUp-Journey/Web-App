import { ENV } from "@/lib/env";
import {
    signInAction,
    signUpAction,
    validateTokenAction,
} from "../server/auth.actions";
import type { SignInRequest, SignUpRequest } from "./auth.response";

export class AuthController {
    // Working
    public static async signIn(request: SignInRequest) {
        await signInAction(request);
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
