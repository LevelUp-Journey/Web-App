import type { UserResponse } from "./user.response";
import {
    getUserByIdAction,
    getUserByUsernameAction,
} from "../server/user.actions";

export class UserController {
    static async getUserById(id: string): Promise<UserResponse | null> {
        const response = await getUserByIdAction(id);

        if (response.status === 200) {
            const data = response.data as UserResponse;
            return {
                ...data,
                userId: data.userId || data.id,
            };
        }

        return null;
    }

    static async getUserByUsername(
        username: string,
    ): Promise<UserResponse | null> {
        const response = await getUserByUsernameAction(username);

        if (response.status === 200) {
            const data = response.data as UserResponse;
            return {
                ...data,
                userId: data.userId || data.id,
            };
        }

        return null;
    }
}
