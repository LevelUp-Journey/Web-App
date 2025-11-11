import { create } from "zustand";
import type {
    GuideResponse,
    PageResponse,
} from "@/services/internal/learning/guides/controller/guide.response";

export interface GuideEditorChallengeSummary {
    id: string;
    name: string;
    language: string;
}

interface GuideEditorState {
    guide: GuideResponse | null;
    pages: PageResponse[];
    relatedChallenges: GuideEditorChallengeSummary[];
    activePageId: string | null;
    isSaving: boolean;
    isPublishing: boolean;
    isReordering: boolean;
    isPageOperationPending: boolean;
    initialize: (
        guide: GuideResponse,
        challenges: GuideEditorChallengeSummary[],
    ) => void;
    applyGuideResponse: (guide: GuideResponse) => void;
    setPages: (pages: PageResponse[]) => void;
    setActivePageId: (pageId: string | null) => void;
    setChallenges: (challenges: GuideEditorChallengeSummary[]) => void;
    setSaving: (value: boolean) => void;
    setPublishing: (value: boolean) => void;
    setReordering: (value: boolean) => void;
    setPageOperationPending: (value: boolean) => void;
    reset: () => void;
}

function dedupeAndSortPages(pages: PageResponse[]): PageResponse[] {
    const map = new Map<string, PageResponse>();
    pages.forEach((page) => {
        map.set(page.id, page);
    });
    return Array.from(map.values()).sort(
        (a, b) => a.orderNumber - b.orderNumber,
    );
}

function dedupeChallenges(
    challenges: GuideEditorChallengeSummary[],
): GuideEditorChallengeSummary[] {
    const map = new Map<string, GuideEditorChallengeSummary>();
    challenges.forEach((challenge) => {
        map.set(challenge.id, challenge);
    });
    return Array.from(map.values());
}

function mapGuideChallenges(
    guide: GuideResponse | null,
): GuideEditorChallengeSummary[] {
    if (!guide?.challenges?.length) {
        return [];
    }

    return dedupeChallenges(
        guide.challenges.map((challenge) => ({
            id: challenge.id,
            name: challenge.name,
            language: challenge.language || "Unknown",
        })),
    );
}

export const useGuideEditorStore = create<GuideEditorState>((set) => ({
    guide: null,
    pages: [],
    relatedChallenges: [],
    activePageId: null,
    isSaving: false,
    isPublishing: false,
    isReordering: false,
    isPageOperationPending: false,

    initialize: (guide, challenges) => {
        const normalizedPages = dedupeAndSortPages(guide.pages ?? []);
        const normalizedChallenges = challenges.length
            ? dedupeChallenges(challenges)
            : mapGuideChallenges(guide);
        set({
            guide: {
                ...guide,
                pages: normalizedPages,
                pagesCount: normalizedPages.length,
            },
            pages: normalizedPages,
            activePageId: normalizedPages[0]?.id ?? null,
            relatedChallenges: normalizedChallenges,
        });
    },

    applyGuideResponse: (guide) => {
        const normalizedPages = dedupeAndSortPages(guide.pages ?? []);
        const normalizedChallenges = mapGuideChallenges(guide);
        set((state) => ({
            guide: {
                ...guide,
                pages: normalizedPages,
                pagesCount: normalizedPages.length,
            },
            pages: normalizedPages,
            activePageId:
                state.activePageId &&
                normalizedPages.some((p) => p.id === state.activePageId)
                    ? state.activePageId
                    : (normalizedPages[0]?.id ?? null),
            relatedChallenges: normalizedChallenges,
        }));
    },

    setPages: (pages) => {
        const normalizedPages = dedupeAndSortPages(pages ?? []);
        set((state) => ({
            pages: normalizedPages,
            guide: state.guide
                ? {
                      ...state.guide,
                      pages: normalizedPages,
                      pagesCount: normalizedPages.length,
                  }
                : state.guide,
            activePageId:
                state.activePageId &&
                normalizedPages.some((p) => p.id === state.activePageId)
                    ? state.activePageId
                    : (normalizedPages[0]?.id ?? null),
        }));
    },

    setActivePageId: (pageId) => {
        set((state) => {
            if (!pageId) {
                return { activePageId: null };
            }
            const exists = state.pages.some((page) => page.id === pageId);
            return {
                activePageId: exists ? pageId : state.activePageId,
            };
        });
    },

    setChallenges: (challenges) =>
        set({ relatedChallenges: dedupeChallenges(challenges) }),

    setSaving: (value) => set({ isSaving: value }),

    setPublishing: (value) => set({ isPublishing: value }),

    setReordering: (value) => set({ isReordering: value }),

    setPageOperationPending: (value) => set({ isPageOperationPending: value }),

    reset: () =>
        set({
            guide: null,
            pages: [],
            relatedChallenges: [],
            activePageId: null,
            isSaving: false,
            isPublishing: false,
            isReordering: false,
            isPageOperationPending: false,
        }),
}));
