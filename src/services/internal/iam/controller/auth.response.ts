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

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
    message: string;
}

export interface JWTPayload {
    sub: string;
    userId: string;
    email: string;
    roles: string[];
    iat: number;
    exp: number;
}

export interface SearchUsersRequest {
    username: string;
}

export interface UserSearchResult {
    id: string;
    email: string;
    username: string;
    profilePicture: string;
}
