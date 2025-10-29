import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLocalizedPaths } from "@/lib/paths";
import { GuideController } from "@/services/internal/learning/controller/guide.controller";

export default async function GuidePage({
    params,
}: {
    params: Promise<{ lang: string; id: string }>;
}) {
    const { lang, id } = await params;
    const PATHS = getLocalizedPaths(lang);

    try {
        const guide = await GuideController.getById(id);

        return (
            <div className="space-y-6">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{guide.title}</h1>
                        {guide.description && (
                            <p className="text-lg text-muted-foreground">
                                {guide.description}
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline">
                            <Link
                                href={PATHS.DASHBOARD.ADMINISTRATION.GUIDES.EDIT(
                                    id,
                                )}
                            >
                                Edit Guide
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link
                                href={
                                    PATHS.DASHBOARD.ADMINISTRATION.GUIDES.ROOT
                                }
                            >
                                Back to Guides
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Guide Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-slate max-w-none dark:prose-invert">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({
                                                node,
                                                inline,
                                                className,
                                                children,
                                                ...props
                                            }) {
                                                const match =
                                                    /language-(\w+)/.exec(
                                                        className || "",
                                                    );
                                                return !inline && match ? (
                                                    <SyntaxHighlighter
                                                        language={match[1]}
                                                        PreTag="div"
                                                    >
                                                        {String(
                                                            children,
                                                        ).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code
                                                        className={className}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            },
                                        }}
                                    >
                                        {guide.markdownContent}
                                    </ReactMarkdown>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Guide Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">
                                        Status
                                    </span>
                                    <Badge
                                        variant={
                                            guide.status === "PUBLISHED"
                                                ? "default"
                                                : guide.status === "DRAFT"
                                                  ? "secondary"
                                                  : "outline"
                                        }
                                    >
                                        {guide.status}
                                    </Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        Order
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {guide.orderIndex}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        Likes
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {guide.totalLikes}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        Author ID
                                    </span>
                                    <span className="text-sm text-muted-foreground font-mono">
                                        {guide.authorId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        Course ID
                                    </span>
                                    <span className="text-sm text-muted-foreground font-mono">
                                        {guide.courseId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        Created
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(
                                            guide.createdAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                        Updated
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date(
                                            guide.updatedAt,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Error loading guide:", error);
        notFound();
    }
}
