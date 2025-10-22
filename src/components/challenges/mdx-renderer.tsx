import type { MDXComponents } from "mdx/types";
import { MDXRemote } from "next-mdx-remote-client/rsc";

interface MdxRendererProps {
    source: string;
}

const components: MDXComponents = {
    h1: (props) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
    h2: (props) => (
        <h2 className="text-3xl font-semibold mt-6 mb-3" {...props} />
    ),
    h3: (props) => (
        <h3 className="text-2xl font-semibold mt-5 mb-2" {...props} />
    ),
    h4: (props) => <h4 className="text-xl font-medium mt-4 mb-2" {...props} />,
    h5: (props) => <h5 className="text-lg font-medium mt-3 mb-2" {...props} />,
    h6: (props) => (
        <h6 className="text-base font-medium mt-2 mb-1" {...props} />
    ),
    p: (props) => <p className="text-base leading-relaxed mb-4" {...props} />,
    ul: (props) => (
        <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
    ),
    ol: (props) => (
        <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
    ),
    li: (props) => <li className="ml-4" {...props} />,
    blockquote: (props) => (
        <blockquote
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300"
            {...props}
        />
    ),
    code: (props) => (
        <code
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono"
            {...props}
        />
    ),
    pre: (props) => (
        <pre
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4"
            {...props}
        />
    ),
    a: (props) => (
        <a
            className="text-blue-600 dark:text-blue-400 hover:underline"
            {...props}
        />
    ),
    strong: (props) => <strong className="font-bold" {...props} />,
    em: (props) => <em className="italic" {...props} />,
    hr: (props) => (
        <hr className="my-6 border-gray-300 dark:border-gray-600" {...props} />
    ),
    table: (props) => (
        <div className="overflow-x-auto mb-4">
            <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
            />
        </div>
    ),
    thead: (props) => (
        <thead className="bg-gray-50 dark:bg-gray-800" {...props} />
    ),
    tbody: (props) => (
        <tbody
            className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
            {...props}
        />
    ),
    tr: (props) => <tr {...props} />,
    th: (props) => (
        <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
            {...props}
        />
    ),
    td: (props) => (
        <td className="px-6 py-4 whitespace-nowrap text-sm" {...props} />
    ),
};

export default async function MdxRenderer({ source }: MdxRendererProps) {
    if (!source) {
        return (
            <p className="text-muted-foreground italic">
                No description provided.
            </p>
        );
    }

    return (
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-code:bg-muted prose-blockquote:text-muted-foreground">
            <MDXRemote source={source} components={components} />
        </div>
    );
}
