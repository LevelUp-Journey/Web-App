"use client";

import Autoplay from "embla-carousel-autoplay";
import { Search, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import type { ChallengeResponse } from "@/services/internal/challenges/controller/challenge.response";

export default function DashboardPage() {
    const [challenges, setChallenges] = useState<ChallengeResponse[]>([]);
    const [filteredChallenges, setFilteredChallenges] = useState<
        ChallengeResponse[]
    >([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const data = await ChallengeController.getPublicChallenges();
                setChallenges(data);
                setFilteredChallenges(data);
            } catch (error) {
                console.error("Failed to fetch challenges:", error);
            }
        };
        fetchChallenges();
    }, []);

    useEffect(() => {
        const filtered = challenges.filter(
            (challenge) =>
                challenge.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                challenge.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                challenge.tags.some((tag) =>
                    tag.name.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
        );
        setFilteredChallenges(filtered);
    }, [searchQuery, challenges]);

    return (
        <div className="space-y-4 w-full">
            {/* Search Bar - Centered */}
            <div className="flex justify-center pt-4">
                <div className="relative max-w-md w-full">
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <SearchIcon />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end">
                            <InputGroupButton>Search</InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </div>
            </div>

            {/* Carousel - Full Width */}
            <Carousel
                opts={{ loop: true }}
                plugins={[Autoplay({ delay: 3000 })]}
                className="w-full"
            >
                <CarouselContent>
                    <CarouselItem>
                        <div className="flex items-center justify-center h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <h2 className="text-3xl font-bold text-white">
                                UPC Announcement
                            </h2>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="flex items-center justify-center h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <h2 className="text-3xl font-bold text-white">
                                UPC Announcement
                            </h2>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="flex items-center justify-center h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <h2 className="text-3xl font-bold text-white">
                                UPC Announcement
                            </h2>
                        </div>
                    </CarouselItem>
                    <CarouselItem>
                        <div className="flex items-center justify-center h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                            <h2 className="text-3xl font-bold text-white">
                                UPC Announcement
                            </h2>
                        </div>
                    </CarouselItem>
                    {/* Add more items if needed */}
                </CarouselContent>
            </Carousel>

            {/* Challenges List */}
            <div className="container mx-auto p-4 space-y-4">
                <h2 className="text-2xl font-semibold">Challenges</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredChallenges.map((challenge) => (
                        <Card
                            key={challenge.id}
                            className="hover:shadow-lg transition-shadow"
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    {challenge.name}
                                    <Badge variant="secondary">
                                        {challenge.experiencePoints} XP
                                    </Badge>
                                </CardTitle>
                                <CardDescription>
                                    {challenge.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {challenge.tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            style={{
                                                backgroundColor: tag.color,
                                            }}
                                        >
                                            {tag.name}
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Status: {challenge.status}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
