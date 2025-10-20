"use client";

import { ShadcnTemplate } from "@/components/challenges/editor/lexkitEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function CreateChallengePage() {
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

            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[600px]"
            >
                {/* Left Column - Form Fields */}
                <ResizablePanel defaultSize={40} minSize={30}>
                    <div className="space-y-6 p-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Challenge Title</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
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
                                placeholder="e.g., JavaScript, React, Node.js"
                            />
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-2">
                            <Label htmlFor="difficulty">Difficulty Level</Label>
                            <Input
                                type="text"
                                id="difficulty"
                                name="difficulty"
                                placeholder="e.g., Easy, Medium, Hard, Expert"
                            />
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
                                min="0"
                                placeholder="100"
                            />
                        </div>
                    </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Column - Rich Text Editor */}
                <ResizablePanel defaultSize={60} maxSize={70} minSize={50}>
                    <div className="space-y-2 p-4">
                        <Label>Description</Label>
                        <ShadcnTemplate />
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
