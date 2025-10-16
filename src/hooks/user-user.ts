import { create } from "zustand";
export interface UserStore {
    userId: string;
    email: string;
}
export interface UserStoreActions {
    setUser: (user: UserStore) => void;
}

export const useUser = create<UserStore & UserStoreActions>((set) => ({
    userId: "",
    email: "",
    setUser: (user: UserStore) => set(user),
}));
