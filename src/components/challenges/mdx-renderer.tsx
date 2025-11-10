"use client";

import { hydrate, type SerializeResult } from "next-mdx-remote-client/csr";
import { useDictionary } from "@/hooks/use-dictionary";
import { useMDXComponents } from "../../../mdx-components";

interface MdxRendererProps {
    serializedSource: SerializeResult | null;
}

export default function MdxRenderer({ serializedSource }: MdxRendererProps) {
    const components = useMDXComponents();
    const dict = useDictionary();
    if (!serializedSource) {
        return (
            <p className="text-muted-foreground italic">
                {dict?.challenges?.messages?.noDescription ||
                    "No description provided."}
            </p>
        );
    }

    if ("error" in serializedSource) {
        return (
            <p className="text-red-500 italic">
                {dict?.challenges?.messages?.errorRenderingDescription?.replace(
                    "{error}",
                    serializedSource.error.message,
                ) ||
                    `Error rendering description: ${serializedSource.error.message}`}
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
        <div className="prose prose-xs max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-code:bg-muted prose-blockquote:text-muted-foreground prose-table:border-collapse prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700">
            {content}
        </div>
    );
}
