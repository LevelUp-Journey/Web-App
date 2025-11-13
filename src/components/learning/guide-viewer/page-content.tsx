"use client";

import { serialize } from "next-mdx-remote-client/serialize";
import { useEffect, useState } from "react";
import MdxRenderer from "@/components/challenges/mdx-renderer";
import { mdxOptions } from "@/lib/mdx-config";

interface PageContentProps {
    content: string;
}

export function PageContent({ content }: PageContentProps) {
    const [serializedContent, setSerializedContent] = useState<Awaited<
        ReturnType<typeof serialize>
    > | null>(null);

    useEffect(() => {
        serialize({ source: content, ...mdxOptions }).then(
            setSerializedContent,
        );
    }, [content]);

    if (!serializedContent) {
        return <div className="animate-pulse">Loading content...</div>;
    }

    return <MdxRenderer serializedSource={serializedContent} />;
}
