import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    // Configure `pageExtensions` to include MDX files for imports
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    i18n: {
        locales: ['en', 'es'],
        defaultLocale: 'en',
    },
};

const withMDX = createMDX({
    // Add markdown plugins here, as desired
    options: {
        remarkPlugins: [],
        rehypePlugins: [],
    },
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
