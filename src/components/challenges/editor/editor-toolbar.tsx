"use client";

import { Button } from "@/components/ui/button";
import type { EditorToolbarProps } from "./editor.types";
import { useEditor } from "./editor-config";

/**
 * EditorToolbar component
 * Provides formatting controls for the rich text editor
 */
export function EditorToolbar({ className }: EditorToolbarProps) {
    const { commands, activeStates } = useEditor();

    return (
        <div
            className={`flex flex-wrap gap-1 p-2 border-b bg-muted/30 ${className || ""}`}
        >
            {/* Text Formatting */}
            <Button
                type="button"
                size="sm"
                variant={activeStates.bold ? "secondary" : "ghost"}
                onClick={() => commands.toggleBold()}
                aria-label="Toggle bold"
            >
                <strong>B</strong>
            </Button>

            <Button
                type="button"
                size="sm"
                variant={activeStates.italic ? "secondary" : "ghost"}
                onClick={() => commands.toggleItalic()}
                aria-label="Toggle italic"
            >
                <em>I</em>
            </Button>

            <Button
                type="button"
                size="sm"
                variant={activeStates.underline ? "secondary" : "ghost"}
                onClick={() => commands.toggleUnderline()}
                aria-label="Toggle underline"
            >
                <u>U</u>
            </Button>

            <Button
                type="button"
                size="sm"
                variant={activeStates.strikethrough ? "secondary" : "ghost"}
                onClick={() => commands.toggleStrikethrough()}
                aria-label="Toggle strikethrough"
            >
                <s>S</s>
            </Button>

            <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

            {/* Lists */}
            <Button
                type="button"
                size="sm"
                variant={activeStates.unorderedList ? "secondary" : "ghost"}
                onClick={() => commands.toggleUnorderedList()}
                aria-label="Toggle bullet list"
            >
                • List
            </Button>

            <Button
                type="button"
                size="sm"
                variant={activeStates.orderedList ? "secondary" : "ghost"}
                onClick={() => commands.toggleOrderedList()}
                aria-label="Toggle numbered list"
            >
                1. List
            </Button>

            <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />

            {/* Special Elements */}
            <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => commands.insertHorizontalRule()}
                aria-label="Insert horizontal rule"
            >
                ―
            </Button>
        </div>
    );
}
