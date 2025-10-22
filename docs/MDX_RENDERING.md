# MDX Rendering in Challenges

This document explains how Markdown/MDX rendering is implemented for challenge descriptions in the application.

## Overview

The application uses `next-mdx-remote-client` to render Markdown content dynamically on the server. This allows challenge descriptions to be stored as plain Markdown text in the database and rendered as rich HTML content on the page.

## Architecture

### Components

1. **MdxRenderer** (`src/components/challenges/mdx-renderer.tsx`)
   - Server Component that handles MDX compilation and rendering
   - Accepts a `source` string prop containing Markdown content
   - Returns fully rendered React components

2. **ChallengeSummary** (`src/components/challenges/challenge-summary.tsx`)
   - Client Component for interactive UI elements
   - Receives pre-rendered MDX as `React.ReactNode`
   - No longer handles MDX compilation (moved to server)

3. **Page Component** (`src/app/(protected)/dashboard/(no-students)/challenges/edit/[challengeId]/page.tsx`)
   - Server Component that fetches challenge data
   - Passes challenge description to `MdxRenderer`
   - Passes rendered result to `ChallengeSummary`

## Configuration

### Dependencies

The following packages are installed and configured:

```json
{
  "@next/mdx": "^15.5.6",
  "@mdx-js/loader": "^3.1.1",
  "@mdx-js/mdx": "^3.1.1",
  "@mdx-js/react": "^3.1.1",
  "@types/mdx": "^2.0.13",
  "next-mdx-remote-client": "^2.1.7",
  "remark-gfm": "^4.0.1",
  "@tailwindcss/typography": "^0.5.19"
}
```

### next.config.ts

```typescript
import createMDX from "@next/mdx";

const nextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
    extension: /\.(md|mdx)$/,
    options: {
        remarkPlugins: ["remark-gfm"],
        rehypePlugins: [],
    },
});

export default withMDX(nextConfig);
```

### mdx-components.tsx

Global MDX components are defined in the root `mdx-components.tsx` file. These apply to `.mdx` files used as pages/routes.

## Usage

### Rendering Challenge Descriptions

```tsx
import MdxRenderer from "@/components/challenges/mdx-renderer";

// In your Server Component
export default async function Page() {
  const challenge = await fetchChallenge();
  
  return (
    <div>
      <MdxRenderer source={challenge.description || ""} />
    </div>
  );
}
```

### Supported Markdown Features

The `MdxRenderer` component supports:

- **Headings**: `# H1` through `###### H6`
- **Paragraphs**: Regular text
- **Lists**: Ordered (`1.`) and unordered (`-` or `*`)
- **Links**: `[text](url)`
- **Emphasis**: `*italic*` and `**bold**`
- **Code**: Inline `` `code` `` and code blocks
- **Blockquotes**: `> quote`
- **Tables**: Full table support
- **Horizontal Rules**: `---`
- **GitHub Flavored Markdown**: Thanks to `remark-gfm`

### Example Markdown Input

```markdown
# Challenge: Binary Search

## Description

Implement a **binary search** algorithm that finds the position of a target value within a sorted array.

### Requirements

1. The input array is sorted in ascending order
2. Return the index of the target value
3. Return `-1` if the target is not found

### Example

```javascript
binarySearch([1, 2, 3, 4, 5], 3) // returns 2
binarySearch([1, 2, 3, 4, 5], 6) // returns -1
```

> **Note**: The time complexity should be O(log n)

### Constraints

- Array length: `1 <= n <= 10^4`
- Array values: `-10^4 <= arr[i] <= 10^4`
```

## Styling

### Tailwind Typography

The component uses Tailwind's typography plugin for base styling:

```tsx
<div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
  <MDXRemote source={source} components={components} />
</div>
```

### Custom Component Styles

Individual MDX components have custom Tailwind classes for consistent styling:

- Headings: Progressive font sizes with appropriate margins
- Code blocks: Gray background with rounded corners
- Lists: Proper indentation and spacing
- Tables: Responsive with dividers
- Links: Blue color with hover effects

## Performance Considerations

### Server-Side Rendering

- MDX compilation happens on the server
- Reduces client-side JavaScript bundle size
- Improves initial page load performance
- Content is pre-rendered and cached

### Caching Strategy

Since challenges are relatively static, the rendered MDX benefits from Next.js's automatic caching:

1. Initial render is server-side
2. Subsequent requests use cached HTML
3. Revalidate only when challenge is updated

## Troubleshooting

### Common Issues

**Issue**: MDX content not rendering

- Check that `source` prop is not null/undefined
- Verify Markdown syntax is valid
- Check browser console for compilation errors

**Issue**: Styling not applied

- Ensure `@tailwindcss/typography` is installed
- Verify Tailwind configuration includes prose classes
- Check that dark mode classes are properly configured

**Issue**: Code blocks not highlighting

- Custom syntax highlighting can be added with rehype plugins
- Consider `rehype-pretty-code` or `rehype-highlight`

## Future Enhancements

Potential improvements to consider:

1. **Syntax Highlighting**: Add a rehype plugin for code syntax highlighting
2. **Custom Components**: Allow embedding React components in MDX
3. **LaTeX Support**: Add math equation rendering with `rehype-katex`
4. **Mermaid Diagrams**: Support flowcharts and diagrams
5. **Table of Contents**: Auto-generate TOC from headings
6. **Copy Button**: Add copy-to-clipboard for code blocks

## References

- [Next.js MDX Documentation](https://nextjs.org/docs/app/building-your-application/configuring/mdx)
- [next-mdx-remote-client](https://github.com/ipikuka/next-mdx-remote-client)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)