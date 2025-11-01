import {
    createTopicAction,
    deleteTopicAction,
    getAllTopicsAction,
    getTopicByIdAction,
    searchTopicsByNameAction,
    updateTopicAction,
} from "./topic.actions";
import type {
    CreateTopicRequest,
    DeleteTopicRequest,
    SearchTopicRequest,
    TopicResponse,
    UpdateTopicRequest,
} from "./topic.response";

export class TopicController {
    public static async getAllTopics(): Promise<TopicResponse[]> {
        const response = await getAllTopicsAction();
        return response;
    }

    public static async createTopic(
        request: CreateTopicRequest,
    ): Promise<TopicResponse> {
        const response = await createTopicAction(request);
        return response;
    }

    public static async getTopicById(topicId: string): Promise<TopicResponse> {
        const response = await getTopicByIdAction(topicId);
        return response;
    }

    public static async updateTopic(
        request: UpdateTopicRequest,
    ): Promise<TopicResponse> {
        const response = await updateTopicAction(request);
        return response;
    }

    public static async deleteTopic(
        request: DeleteTopicRequest,
    ): Promise<void> {
        await deleteTopicAction(request);
    }

    public static async searchTopicsByName(
        request: SearchTopicRequest,
    ): Promise<TopicResponse[]> {
        const response = await searchTopicsByNameAction(request);
        return response;
    }
}
