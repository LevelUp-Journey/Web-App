"use server";

import {
    PROFILE_HTTP,
    type RequestFailure,
    type RequestSuccess,
} from "@/services/axios.config";
import type { ProfileResponse } from "../controller/profile.response";

export async function getProfileAction(
    profileId: string,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    const response = await PROFILE_HTTP.get<ProfileResponse>(
        `/profiles/user/${profileId}`,
    );
    return { data: response.data, status: response.status };
}

export async function updateProfileAction(
    profileId: string,
    data: FormData,
): Promise<RequestSuccess<ProfileResponse> | RequestFailure> {
    const response = await PROFILE_HTTP.put<ProfileResponse>(
        `/profiles/${profileId}`,
        data,
    );
    return { data: response.data, status: response.status };
}
