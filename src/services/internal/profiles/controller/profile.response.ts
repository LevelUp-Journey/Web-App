export interface ProfileResponse {
    id: string;
    username: string;
    profileUrl: string;
    firstName: string;
    lastName: string;
}

// TODO: When we request a profile, at backend should be implemented only if the user is logged in. then all fields should be returned.
// Otherwise, only the id, username, and profileUrl should be returned.

export interface UpdateProfileRequest {
    id: string;
    username: string;
    profileUrl: string;
    firstName: string;
    lastName: string;
}
