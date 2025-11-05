export interface TopicResponse {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTopicRequest {
    name: string;
}

export interface GetTopicByIdRequest {
    id: string;
}

export interface UpdateTopicRequest extends CreateTopicRequest {
    id: string;
}

export interface DeleteTopicRequest {
    id: string;
}

export interface SearchTopicRequest {
    name: string;
}
