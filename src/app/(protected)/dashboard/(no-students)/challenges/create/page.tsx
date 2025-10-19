"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShadcnTemplate } from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChallengeDifficulty } from "@/lib/consts";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";
import type { CreateChallengeRequest } from "@/services/internal/challenges/controller/challenge.response";

export default function CreateChallengePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        tags: "",
        difficulty: ChallengeDifficulty.EASY,
        experiencePoints: 100,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "experiencePoints" ? Number(value) : value,
        }));
    };

    const handleDifficultyChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            difficulty: value as ChallengeDifficulty,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // TODO: Get actual teacherId from auth context
            const teacherId = "00000000-0000-0000-0000-000000000000";

            // Parse tags (comma separated for now)
            const tagIds = formData.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag.length > 0);

            const request: CreateChallengeRequest = {
                teacherId,
                name: formData.name,
                description: "",
                experiencePoints: formData.experiencePoints,
                difficulty: formData.difficulty,
                tagIds,
            };

            await ChallengeController.createChallenge(request);
            router.push("/dashboard/admin");
        } catch (error) {
            console.error("Error creating challenge:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Create New Challenge
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to create a new challenge for
                    students.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Form Fields */}
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Challenge Title</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter challenge title"
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                placeholder="e.g., JavaScript, React, Node.js"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty Level</Label>
                            <Select
                                value={formData.difficulty}
                                onValueChange={handleDifficultyChange}
                            >
                                <SelectTrigger id="difficulty">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem
                                        value={ChallengeDifficulty.EASY}
                                    >
                                        Easy
                                    </SelectItem>
                                    <SelectItem
                                        value={ChallengeDifficulty.MEDIUM}
                                    >
                                        Medium
                                    </SelectItem>
                                    <SelectItem
                                        value={ChallengeDifficulty.HARD}
                                    >
                                        Hard
                                    </SelectItem>
                                    <SelectItem
                                        value={ChallengeDifficulty.EXPERT}
                                    >
                                        Expert
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Experience Points */}
                        <div className="space-y-2">
                            <Label htmlFor="experiencePoints">
                                Experience Points
                            </Label>
                            <Input
                                type="number"
                                id="experiencePoints"
                                name="experiencePoints"
                                value={formData.experiencePoints}
                                onChange={handleInputChange}
                                min="0"
                                required
                                placeholder="100"
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1"
                            >
                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Challenge"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>

                    {/* Right Column - Rich Text Editor */}
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <ShadcnTemplate />
                    </div>
                </div>
            </form>
        </div>
    );
}
