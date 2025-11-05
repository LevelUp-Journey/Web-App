"use client";

import Editor from "@monaco-editor/react";

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
    return (
        <Editor
            height="100%"
            language={language}
            value={value}
            onChange={onChange}
            theme="vs-dark"
            className="rounded-md overflow-hidden"
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
