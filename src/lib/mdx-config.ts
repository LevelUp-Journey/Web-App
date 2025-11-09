/**
 * Centralized MDX configuration for remark and rehype plugins
 * Provides GitHub Flavored Markdown support including tables, task lists, etc.
 */

import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/**
 * MDX plugins configuration for consistent rendering across the app
 */
export const mdxOptions = {
    mdxOptions: {
        remarkPlugins: [
            // GitHub Flavored Markdown support (tables, task lists, strikethrough, etc.)
            remarkGfm,
        ],
        rehypePlugins: [
            // Allow raw HTML in markdown
            rehypeRaw,
            // Generate IDs for headings
            rehypeSlug,
            // Add anchor links to headings (GitHub style)
            [
                rehypeAutolinkHeadings,
                {
                    behavior: "wrap",
                    properties: {
                        className: ["anchor"],
                    },
                },
            ],
        ],
    },
};
