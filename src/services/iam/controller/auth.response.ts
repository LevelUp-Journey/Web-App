export interface SignUpRequest {
    email: string;
    password: string;
}

export interface SignUpResponse {
    id: string;
    email: string;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    id: string;
    email: string;
    token: string;
    refreshToken: string;
}
