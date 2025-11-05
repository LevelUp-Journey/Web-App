import { create } from "zustand";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";

interface GuideData {
    guide: GuideResponse;
    author: ProfileResponse;
    currentPage: number;
}

interface GuideStore {
    // Estado
    guides: Map<string, GuideData>;

    // Acciones
    setGuideData: (
        guideId: string,
        guide: GuideResponse,
        author: ProfileResponse,
    ) => void;
    getGuideData: (guideId: string) => GuideData | undefined;
    setCurrentPage: (guideId: string, page: number) => void;
    getCurrentPage: (guideId: string) => number;
    clearGuide: (guideId: string) => void;
    clearAllGuides: () => void;
}

export const useGuideStore = create<GuideStore>((set, get) => ({
    guides: new Map(),

    setGuideData: (guideId, guide, author) => {
        set((state) => {
            const newGuides = new Map(state.guides);
            newGuides.set(guideId, {
                guide,
                author,
                currentPage: 1,
            });
            return { guides: newGuides };
        });
    },

    getGuideData: (guideId) => {
        return get().guides.get(guideId);
    },

    setCurrentPage: (guideId, page) => {
        set((state) => {
            const newGuides = new Map(state.guides);
            const guideData = newGuides.get(guideId);
            if (guideData) {
                newGuides.set(guideId, {
                    ...guideData,
                    currentPage: page,
                });
            }
            return { guides: newGuides };
        });
    },

    getCurrentPage: (guideId) => {
        const guideData = get().guides.get(guideId);
        return guideData?.currentPage || 1;
    },

    clearGuide: (guideId) => {
        set((state) => {
            const newGuides = new Map(state.guides);
            newGuides.delete(guideId);
            return { guides: newGuides };
        });
    },

    clearAllGuides: () => {
        set({ guides: new Map() });
    },
}));
