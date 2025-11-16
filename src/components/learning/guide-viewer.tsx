"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useGuide } from "@/hooks/use-guide";
import type { GuideResponse } from "@/services/internal/learning/guides/controller/guide.response";
import type { ProfileResponse } from "@/services/internal/profiles/profiles/controller/profile.response";
import { GuideErrorPage } from "./guide-viewer/guide-error-page";
import { GuideOverview } from "./guide-viewer/guide-overview";
import { GuideReadingMode } from "./guide-viewer/guide-reading-mode";

interface GuideViewerProps {
    guide: GuideResponse;
    author: ProfileResponse;
}

export function GuideViewer({ guide, author }: GuideViewerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Usar hook personalizado para manejar el guide
    const { guide: storedGuide } = useGuide({
        guideId: guide.id,
        guide,
        author,
    });

    // Determinar el índice de página actual basado en la URL
    const pageParam = searchParams.get("page");
    const pageNumber = pageParam ? parseInt(pageParam, 10) : null;
    const currentPageIndex = pageNumber ? pageNumber - 1 : -1;

    // Validar que la página está en el rango válido
    const isValidPage =
        currentPageIndex >= 0 && currentPageIndex < storedGuide.pagesCount;
    const isReadingMode = pageNumber !== null && isValidPage;

    const hasPreviousPage = currentPageIndex > 0;
    const hasNextPage = currentPageIndex < storedGuide.pagesCount - 1;

    const handleNextPage = () => {
        if (hasNextPage) {
            const nextPage = currentPageIndex + 2; // +2 porque el índice es 0-based pero la URL es 1-based
            router.replace(`?page=${nextPage}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePreviousPage = () => {
        if (hasPreviousPage) {
            const prevPage = currentPageIndex; // currentPageIndex ya es el anterior en 1-based
            router.replace(`?page=${prevPage}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleBackToOverview = () => {
        router.replace(window.location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleStartReading = () => {
        router.push(`?page=1`);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleGoToPage = (pageIndex: number) => {
        const pageNum = pageIndex + 1; // Convertir índice 0-based a número de página 1-based
        // Validar que la página está en el rango
        if (pageNum >= 1 && pageNum <= storedGuide.pagesCount) {
            router.replace(`?page=${pageNum}`);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Si hay un parámetro de página pero no es válido, mostrar mensaje de error
    if (pageNumber !== null && !isValidPage) {
        return (
            <GuideErrorPage
                pageNumber={pageNumber}
                totalPages={storedGuide.pagesCount}
                onBackToOverview={handleBackToOverview}
            />
        );
    }

    // Modo lectura: mostrar página específica
    if (isReadingMode) {
        return (
            <GuideReadingMode
                guide={storedGuide}
                currentPageIndex={currentPageIndex}
                onBackToOverview={handleBackToOverview}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                onGoToPage={handleGoToPage}
                hasPreviousPage={hasPreviousPage}
                hasNextPage={hasNextPage}
                isLastPage={currentPageIndex === storedGuide.pagesCount - 1}
            />
        );
    }

    // Vista de presentación (Overview)
    return (
        <GuideOverview
            guide={storedGuide}
            author={author}
            onStartReading={handleStartReading}
        />
    );
}
