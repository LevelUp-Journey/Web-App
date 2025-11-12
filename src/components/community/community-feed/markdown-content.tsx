"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownContentProps {
    content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
    return (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-blockquote:border-l-4 prose-blockquote:border-muted-foreground prose-blockquote:text-muted-foreground prose-img:rounded-lg">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                    h1: ({ ...props }) => (
                        <h1
                            className="text-2xl font-bold mt-4 mb-2"
                            {...props}
                        />
                    ),
                    h2: ({ ...props }) => (
                        <h2
                            className="text-xl font-bold mt-3 mb-2"
                            {...props}
                        />
                    ),
                    h3: ({ ...props }) => (
                        <h3
                            className="text-lg font-semibold mt-2 mb-1"
                            {...props}
                        />
                    ),
                    code: ({ className, children, ...props }) => {
                        const isInline = !className?.includes("language-");
                        return isInline ? (
                            <code
                                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                            >
                                {children}
                            </code>
                        ) : (
                            <code
                                className={`block bg-muted p-4 rounded-lg text-sm font-mono overflow-x-auto ${className || ""}`}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    },
                    ul: ({ ...props }) => (
                        <ul className="list-disc list-inside my-2" {...props} />
                    ),
                    ol: ({ ...props }) => (
                        <ol
                            className="list-decimal list-inside my-2"
                            {...props}
                        />
                    ),
                    blockquote: ({ ...props }) => (
                        <blockquote
                            className="border-l-4 border-muted-foreground pl-4 italic my-2"
                            {...props}
                        />
                    ),
                    a: ({ ...props }) => (
                        <a
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props}
                        />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
