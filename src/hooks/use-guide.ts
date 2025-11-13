import { useEffect, useRef } from "react";
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

    // Inicializar datos en la store solo una vez
    const hasSavedRef = useRef(false);

    useEffect(() => {
        if (!hasSavedRef.current) {
            const existingData = getGuideData(guideId);
            if (!existingData) {
                setGuideData(guideId, guide, author);
                hasSavedRef.current = true;
            }
        }
    }, [guideId, setGuideData, getGuideData, author, guide]);

    // Obtener datos de la store
    const storedData = getGuideData(guideId);
    const storedGuide = storedData?.guide || guide;
    const storedAuthor = storedData?.author || author;

    return {
        guide: storedGuide,
        author: storedAuthor,
        currentPage: getCurrentPage(guideId),
        setCurrentPage: (page: number) => setCurrentPage(guideId, page),
    };
}
