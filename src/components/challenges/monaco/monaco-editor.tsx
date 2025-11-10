"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface MonacoEditorProps {
    value: string;
    onChange?: (value?: string) => void;
    language: string;
    readOnly?: boolean;
}

export default function MonacoEditor({
    value,
    onChange,
    language,
    readOnly = false,
}: MonacoEditorProps) {
    const { resolvedTheme } = useTheme();
    return (
        <Editor
            height="100%"
            language={language}
            value={value}
            onChange={onChange}
            theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
            className="rounded-md overflow-hidden border"
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                readOnly,
            }}
        />
    );
}
