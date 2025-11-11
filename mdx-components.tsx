import type { MDXComponents } from "mdx/types";
import Image, { type ImageProps } from "next/image";

/**
 * This file allows you to provide custom React components
 * to be used in MDX files. You can import and use any
 * React component you want, including inline styles,
 * components from other libraries, and more.
 */

export function useMDXComponents(
    components: MDXComponents = {},
): MDXComponents {
    return {
        // Customize built-in HTML elements
        h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>
        ),
        h4: ({ children }) => (
            <h4 className="text-xl font-medium mt-3 mb-2">{children}</h4>
        ),
        p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
        ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-4">{children}</ul>
        ),
        ol: ({ children }) => (
            <ol className="list-decimal ml-6 mb-4">{children}</ol>
        ),
        li: ({ children }) => <li className="mb-1">{children}</li>,
        a: ({ children, href }) => (
            <a
                href={href}
                className="text-blue-600 hover:text-blue-800 underline"
                target={href?.startsWith("http") ? "_blank" : undefined}
                rel={
                    href?.startsWith("http") ? "noopener noreferrer" : undefined
                }
            >
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
                {children}
            </blockquote>
        ),
        code: ({ children }) => (
            <code className="bg-muted rounded px-1 py-0.5 text-sm">
                {children}
            </code>
        ),
        pre: ({ children }) => (
            <pre className="bg-muted rounded p-4 overflow-x-auto mb-4">
                {children}
            </pre>
        ),
        img: (props) => (
            <img
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                {...props}
            />
        ),
        // Table components for GFM support
        table: ({ children }) => (
            <div className="overflow-x-auto mb-4">
                <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                    {children}
                </table>
            </div>
        ),
        thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
        ),
        tbody: ({ children }) => <tbody>{children}</tbody>,
        tr: ({ children }) => (
            <tr className="border-b border-gray-300 dark:border-gray-700">
                {children}
            </tr>
        ),
        th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold border border-gray-300 dark:border-gray-700">
                {children}
            </th>
        ),
        td: ({ children }) => (
            <td className="px-4 py-2 border border-gray-300 dark:border-gray-700">
                {children}
            </td>
        ),
        // Add any custom components here
        ...components,
    };
}
