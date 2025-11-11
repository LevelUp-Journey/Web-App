"use server";

import axios from "axios";
import { ENV } from "@/lib/env";
import type {
    CreateSubscriptionRequest,
    Subscription,
} from "../entities/subscription.entity";

const API_URL = `${ENV.SERVICES.COMMUNITY.BASE_URL}/subscriptions`;

export async function getUserSubscriptionsAction(
    userId: string,
): Promise<Subscription[]> {
    try {
        const response = await axios.get<Subscription[]>(
            `${API_URL}/user/${userId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching user subscriptions:", error);
        return [];
    }
}

export async function createSubscriptionAction(
    request: CreateSubscriptionRequest,
): Promise<Subscription | null> {
    try {
        const response = await axios.post<Subscription>(API_URL, request);
        return response.data;
    } catch (error) {
        console.error("Error creating subscription:", error);
        return null;
    }
}

export async function deleteSubscriptionAction(
    subscriptionId: string,
): Promise<boolean> {
    try {
        await axios.delete(`${API_URL}/${subscriptionId}`);
        return true;
    } catch (error) {
        console.error("Error deleting subscription:", error);
        return false;
    }
}

export async function getCommunitySubscribersAction(
    communityId: string,
): Promise<Subscription[]> {
    try {
        const response = await axios.get<Subscription[]>(
            `${API_URL}/community/${communityId}`,
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching community subscribers:", error);
        return [];
    }
}
