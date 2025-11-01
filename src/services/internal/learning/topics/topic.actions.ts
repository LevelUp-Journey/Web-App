"use server";

import { LEARNING_HTTP } from "@/services/axios.config";
import type { LearningResponse } from "../shared";
import type {
    CreateTopicRequest,
    DeleteTopicRequest,
    SearchTopicRequest,
    TopicResponse,
    UpdateTopicRequest,
} from "./topic.response";

export async function getAllTopicsAction(): Promise<TopicResponse[]> {
    const response =
        await LEARNING_HTTP.get<LearningResponse<TopicResponse[]>>("/topics");
    return response.data.data;
}

export async function createTopicAction(
    request: CreateTopicRequest,
): Promise<TopicResponse> {
    const response = await LEARNING_HTTP.post<LearningResponse<TopicResponse>>(
        "/topics",
        request,
    );
    return response.data.data;
}

export async function getTopicByIdAction(
    topicId: string,
): Promise<TopicResponse> {
    const response = await LEARNING_HTTP.get<LearningResponse<TopicResponse>>(
        `/topics/${topicId}`,
    );
    return response.data.data;
}

export async function updateTopicAction(
    request: UpdateTopicRequest,
): Promise<TopicResponse> {
    const response = await LEARNING_HTTP.put<LearningResponse<TopicResponse>>(
        `/topics/${request.id}`,
        {
            name: request.name,
        },
    );
    return response.data.data;
}

export async function deleteTopicAction(
    request: DeleteTopicRequest,
): Promise<void> {
    await LEARNING_HTTP.delete(`/topics/${request.id}`);
}

export async function searchTopicsByNameAction(
    request: SearchTopicRequest,
): Promise<TopicResponse[]> {
    const response = await LEARNING_HTTP.get<LearningResponse<TopicResponse[]>>(
        `/topics/search`,
        {
            params: {
                name: request.name,
            },
        },
    );
    console.log("RESUTLADOS DE TOPICS action ", response.data.data);
    return response.data.data;
}
