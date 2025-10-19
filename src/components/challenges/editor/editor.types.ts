import type { LexicalEditor } from "lexical";

export interface RichTextEditorProps {
    onChange?: (html: string) => void;
    initialValue?: string;
    placeholder?: string;
    className?: string;
}

export interface EditorToolbarProps {
    className?: string;
}

export interface EditorProviderProps {
    children: React.ReactNode;
}

export interface UseEditorReturn {
    editor: LexicalEditor | null;
    getHTML: () => string;
}
