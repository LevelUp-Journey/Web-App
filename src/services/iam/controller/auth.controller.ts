import { IAM_HTTP } from "../axios.config";
import type {
    SignInRequest,
    SignInResponse,
    SignUpRequest,
    SignUpResponse,
} from "./auth.response";
import { AuthTokenHandler } from "./auth-token.handler";

export class AuthController {
    public static async signIn(
        request: SignInRequest,
    ): Promise<SignInResponse> {
        const response = await IAM_HTTP.post<SignInResponse>(
            "/authentication/sign-in",
            request,
        );

        AuthTokenHandler.saveToken(response.data.token);

        return response.data;
    }

    public static async signUp(
        request: SignUpRequest,
    ): Promise<SignUpResponse> {
        const response = await IAM_HTTP.post<SignUpResponse>(
            "/authentication/sign-up",
            request,
        );

        return response.data;
    }
}
