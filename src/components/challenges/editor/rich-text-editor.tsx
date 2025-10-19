"use client";

import { $generateHtmlFromNodes } from "@lexical/html";
import { RichText } from "@lexkit/editor";
import { useEffect } from "react";
import type { RichTextEditorProps } from "./editor.types";
import { useEditor } from "./editor-config";
import { EditorToolbar } from "./editor-toolbar";
import "./editor.styles.css";

/**
 * RichTextEditor component
 * A fully-featured rich text editor with toolbar and HTML export
 */
export function RichTextEditor({
    onChange,
    initialValue,
    placeholder = "Start writing...",
    className,
}: RichTextEditorProps) {
    const { editor } = useEditor();

    // Handle content changes
    useEffect(() => {
        if (!editor || !onChange) return;

        // Listen for editor state changes
        const removeUpdateListener = editor.registerUpdateListener(
            ({ editorState }) => {
                editorState.read(() => {
                    const html = $generateHtmlFromNodes(editor, null);
                    onChange(html);
                });
            },
        );

        return () => {
            removeUpdateListener();
        };
    }, [editor, onChange]);

    // Set initial value if provided
    useEffect(() => {
        if (!editor || !initialValue) return;

        // TODO: Implement HTML to Lexical conversion if needed
        // For now, we start with empty state
    }, [editor, initialValue]);

    return (
        <div className={`border rounded-lg overflow-hidden ${className || ""}`}>
            <EditorToolbar />
            <div className="min-h-[500px] p-4 prose dark:prose-invert max-w-none">
                <RichText placeholder={placeholder} />
            </div>
        </div>
    );
}

/**
 * Hook to get HTML content from editor
 * Use this to manually extract HTML when needed (e.g., on form submit)
 */
export function useEditorContent() {
    const { editor } = useEditor();

    const getHTML = (): string => {
        if (!editor) return "";

        let html = "";
        editor.getEditorState().read(() => {
            html = $generateHtmlFromNodes(editor, null);
        });

        return html;
    };

    return { getHTML };
}
