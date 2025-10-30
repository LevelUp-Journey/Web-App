"use client";

import { hydrate, type SerializeResult } from "next-mdx-remote-client/csr";
import { useMDXComponents } from "../../../mdx-components";

interface MdxRendererProps {
    serializedSource: SerializeResult | null;
}

export default function MdxRenderer({ serializedSource }: MdxRendererProps) {
    const components = useMDXComponents();
    if (!serializedSource) {
        return (
            <p className="text-muted-foreground italic">
                No description provided.
            </p>
        );
    }

    if ("error" in serializedSource) {
        return (
            <p className="text-red-500 italic">
                Error rendering description: {serializedSource.error.message}
            </p>
        );
    }

    const { content } = hydrate({
        compiledSource: serializedSource.compiledSource,
        frontmatter: serializedSource.frontmatter || {},
        scope: serializedSource.scope || {},
        components,
    });

    return (
        <div className="prose prose-xs max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-code:bg-muted prose-blockquote:text-muted-foreground">
            {content}
        </div>
    );
}
