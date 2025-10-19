"use client";

import {
    boldExtension,
    createEditorSystem,
    horizontalRuleExtension,
    italicExtension,
    linkExtension,
    listExtension,
    strikethroughExtension,
    underlineExtension,
} from "@lexkit/editor";

/**
 * Editor extensions configuration
 * These extensions define the available features in the rich text editor
 */
export const editorExtensions = [
    boldExtension,
    italicExtension,
    underlineExtension,
    strikethroughExtension,
    listExtension,
    linkExtension,
    horizontalRuleExtension,
] as const;

/**
 * Create editor system with configured extensions
 */
const { Provider, useEditor: useEditorInternal } =
    createEditorSystem<typeof editorExtensions>();

/**
 * Export editor hook
 */
export const useEditor = useEditorInternal;

/**
 * EditorProvider component that wraps the LexKit Provider with extensions
 */
export function EditorProvider({ children }: { children: React.ReactNode }) {
    return <Provider extensions={editorExtensions}>{children}</Provider>;
}

/**
 * Export extension types for type inference
 */
export type EditorExtensions = typeof editorExtensions;
