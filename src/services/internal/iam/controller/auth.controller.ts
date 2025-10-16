import { toast } from "sonner";
import { ENV } from "@/lib/env";
import {
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
            saveAuthTokenAction(data.token);
            return data;
        }

        toast.error("Error signing in");
        throw new Error("Error signing in");
    }

    // Working
    public static async signUp(request: SignUpRequest) {
        const response = await signUpAction(request);

        console.log("Sign up response", response);

        if (response.status === 201) {
            const user = await AuthController.signIn(request);
            return user;
        }

        console.log(response);
        toast.error("Error signing up");
        throw new Error("Error signing up");
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
        // Delete user data from local storage
        localStorage.clear();
        signOutAction();
    }
}
