import { useState, useMemo } from "react";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";
import type { ProfileResponse } from "@/services/internal/profiles/controller/profile.response";

export function useUserSearch() {
    const [searchResults, setSearchResults] = useState<ProfileResponse[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);

    const searchUsers = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        try {
            setSearchLoading(true);
            setSearchError(null);
            const results = await ProfileController.searchProfiles(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching users:", error);
            setSearchError("Failed to search users");
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setSearchError(null);
    };

    return {
        searchResults,
        searchLoading,
        searchError,
        searchUsers,
        clearSearch,
    };
}