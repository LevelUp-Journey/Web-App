import { useEffect, useMemo, useRef } from "react";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";
import { useGuideStore } from "@/stores/guide-store";

interface UseGuideOptions {
    guideId: string;
    guide: GuideResponse;
    author: ProfileResponse;
}

export function useGuide({ guideId, guide, author }: UseGuideOptions) {
    const setGuideData = useGuideStore((state) => state.setGuideData);
    const getGuideData = useGuideStore((state) => state.getGuideData);
    const setCurrentPage = useGuideStore((state) => state.setCurrentPage);
    const getCurrentPage = useGuideStore((state) => state.getCurrentPage);

    // Memoize guide and author to prevent unnecessary re-renders
    const memoizedGuide = useMemo(
        () => guide,
        [guide.id, guide.title, guide.status],
    );
    const memoizedAuthor = useMemo(
        () => author,
        [author.id, author.firstName, author.lastName],
    );

    // Inicializar datos en la store solo una vez
    const hasSavedRef = useRef(false);

    useEffect(() => {
        if (!hasSavedRef.current) {
            const existingData = getGuideData(guideId);
            if (!existingData) {
                setGuideData(guideId, memoizedGuide, memoizedAuthor);
                hasSavedRef.current = true;
            }
        }
    }, [guideId, setGuideData, getGuideData, memoizedAuthor, memoizedGuide]);

    // Obtener datos de la store
    const storedData = getGuideData(guideId);
    const storedGuide = storedData?.guide || memoizedGuide;
    const storedAuthor = storedData?.author || memoizedAuthor;

    return {
        guide: storedGuide,
        author: storedAuthor,
        currentPage: getCurrentPage(guideId),
        setCurrentPage: (page: number) => setCurrentPage(guideId, page),
    };
}
