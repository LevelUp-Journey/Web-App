"use client";

import { useRef, useState } from "react";
import {
    ShadcnTemplate,
    type ShadcnTemplateRef,
} from "@/components/challenges/editor/lexkitEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ChallengeDifficulty } from "@/lib/consts";

export default function CreateChallengePage() {
    const [difficulty, setDifficulty] = useState(ChallengeDifficulty.EASY);

    const editorRef = useRef<ShadcnTemplateRef>(null);

    const getEditorContent = () => {
        return editorRef.current?.getMarkdown() || "";
    };

    const handleDifficultyChange = (value: string) => {
        setDifficulty(value as ChallengeDifficulty);
    };

    const handleSubmit = () => {
        const markdown = getEditorContent();
        console.log("Content:", { markdown });
    };

    return (
        <section className="h-screen flex flex-col p-4 container mx-auto">
            {/* Header - Fixed height */}
            <header className="flex-shrink-0 p-6 border-b">
                <h1 className="text-3xl font-bold mb-2">
                    Create New Challenge
                </h1>
                <p className="text-muted-foreground">
                    Fill in the details below to create a new challenge for
                    students.
                </p>
            </header>

            {/* Resizable panels - Takes remaining height */}
            <ResizablePanelGroup direction="horizontal" className="h-full">
                {/* Left Column - Form Fields */}
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="h-full overflow-y-auto p-6 flex flex-col gap-4">
                        {/* Title */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="name">Challenge Title</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter challenge title"
                            />
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                                type="text"
                                id="tags"
                                name="tags"
                                placeholder="e.g., JavaScript, React, Node.js"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty Level</Label>
                            <Select
                                value={difficulty}
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
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="experiencePoints">
                                Experience Points
                            </Label>
                            <Input
                                type="number"
                                id="experiencePoints"
                                name="experiencePoints"
                                min="0"
                                placeholder="100"
                            />
                        </div>
                        <div className="text-end" onClick={handleSubmit}>
                            <Button>Create Challenge</Button>
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Column - Rich Text Editor */}
                <ResizablePanel defaultSize={60} maxSize={70} minSize={30}>
                    <div className="h-full overflow-y-auto border-l">
                        <ShadcnTemplate ref={editorRef} />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </section>
    );
}
