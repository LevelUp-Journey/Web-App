"use client";

import { ArrowLeft, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";
import type { Challenge } from "@/services/internal/challenges/challenge/entities/challenge.entity";
import { GuideController } from "@/services/internal/learning/guides/controller/guide.controller";
import type { ChallengeReference } from "@/services/internal/learning/guides/controller/guide.response";

interface ChallengesFormProps {
    guideId: string;
    initialChallenges?: ChallengeReference[];
    onFinish: () => void;
    onGuideUpdate?: (guide: any) => void;
}

export function ChallengesForm({
    guideId,
    initialChallenges = [],
    onFinish,
    onGuideUpdate,
}: ChallengesFormProps) {
    const [currentChallenges, setCurrentChallenges] =
        useState<ChallengeReference[]>(initialChallenges);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Challenge[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [addingChallengeId, setAddingChallengeId] = useState<string | null>(
        null,
    );
    const [removingChallengeId, setRemovingChallengeId] = useState<
        string | null
    >(null);

    // Search challenges
    const handleSearch = useCallback(async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const results = await ChallengeController.searchChallenges(query);
            setSearchResults(results);
        } catch (error) {
            console.error("Error searching challenges:", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchQuery);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, handleSearch]);

    // Add challenge to guide
    const handleAddChallenge = async (challenge: Challenge) => {
        setAddingChallengeId(challenge.id);
        try {
            const updatedGuide = await GuideController.addChallengeToGuide(
                guideId,
                challenge.id,
            );
            setCurrentChallenges((prev) => [
                ...prev,
                { id: challenge.id, name: challenge.name },
            ]);
            setSearchResults((prev) =>
                prev.filter((c) => c.id !== challenge.id),
            );
            onGuideUpdate?.(updatedGuide);
        } catch (error) {
            console.error("Error adding challenge:", error);
            alert("Error adding challenge. Please try again.");
        } finally {
            setAddingChallengeId(null);
        }
    };

    // Remove challenge from guide
    const handleRemoveChallenge = async (challengeId: string) => {
        if (
            !confirm(
                "Are you sure you want to remove this challenge from the guide?",
            )
        ) {
            return;
        }

        setRemovingChallengeId(challengeId);
        try {
            await GuideController.removeChallengeFromGuide(
                guideId,
                challengeId,
            );
            setCurrentChallenges((prev) =>
                prev.filter((c) => c.id !== challengeId),
            );
        } catch (error) {
            console.error("Error removing challenge:", error);
            alert("Error removing challenge. Please try again.");
        } finally {
            setRemovingChallengeId(null);
        }
    };

    return (
        <div className="h-full flex">
            {/* Left Sidebar - Current Challenges */}
            <div className="w-80 border-r flex flex-col bg-muted/20">
                {/* Header */}
                <div className="p-4 border-b">
                    <h3 className="font-semibold">Current Challenges</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        {currentChallenges.length} challenge
                        {currentChallenges.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Challenges List */}
                <ScrollArea className="flex-1 px-4">
                    {currentChallenges.length > 0 ? (
                        <div className="space-y-2 py-4">
                            {currentChallenges.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">
                                            {challenge.name}
                                        </h4>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            handleRemoveChallenge(challenge.id)
                                        }
                                        disabled={
                                            removingChallengeId === challenge.id
                                        }
                                        className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    >
                                        {removingChallengeId ===
                                        challenge.id ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-3 w-3" />
                                        )}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No challenges added yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Search and add challenges from the right
                            </p>
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t">
                    <Button
                        onClick={onFinish}
                        variant="outline"
                        className="w-full"
                        size="sm"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Done
                    </Button>
                </div>
            </div>

            {/* Right Content - Search and Add */}
            <div className="flex-1 flex flex-col">
                {/* Search Header */}
                <div className="p-4 border-b bg-background">
                    <h3 className="font-semibold">Add Challenges</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                        Search for challenges to add to this guide
                    </p>
                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search challenges..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Search Results */}
                <ScrollArea className="flex-1 px-4">
                    {isSearching ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin" />
                            <span className="ml-2">Searching...</span>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="space-y-2 py-4">
                            {searchResults.map((challenge) => (
                                <div
                                    key={challenge.id}
                                    className="flex items-center gap-3 p-3 border rounded-lg bg-card"
                                >
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm truncate">
                                            {challenge.name}
                                        </h4>
                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                            {challenge.description
                                                ? challenge.description.substring(
                                                      0,
                                                      100,
                                                  ) +
                                                  (challenge.description
                                                      .length > 100
                                                      ? "..."
                                                      : "")
                                                : "No description"}
                                        </p>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() =>
                                            handleAddChallenge(challenge)
                                        }
                                        disabled={
                                            addingChallengeId ===
                                                challenge.id ||
                                            currentChallenges.some(
                                                (c) => c.id === challenge.id,
                                            )
                                        }
                                        className="shrink-0"
                                    >
                                        {addingChallengeId === challenge.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Plus className="h-4 w-4 mr-2" />
                                        )}
                                        Add
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : searchQuery ? (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">
                                No challenges found
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Try a different search term
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-sm text-muted-foreground">
                                Start typing to search for challenges
                            </p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}
