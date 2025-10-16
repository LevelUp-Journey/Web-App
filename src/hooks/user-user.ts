import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CONSTS } from "@/lib/consts";

export interface UserStore {
    userId: string;
    email: string;
}
export interface UpdateUserStore extends Partial<UserStore> {}

export interface UserStoreActions {
    setUser: (user: UpdateUserStore) => void;
}

export const useUser = create<UserStore & UserStoreActions>()(
    persist(
        (set) => ({
            userId: "",
            email: "",
            setUser: (user: UpdateUserStore) => set(user),
        }),
        {
            name: CONSTS.USER_STORE_KEY,
            onRehydrateStorage: (state) => {
               
            }
        }
    )
);
