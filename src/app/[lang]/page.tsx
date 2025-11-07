import {
    BookOpen,
    Code2,
    Trophy,
    Users,
    Zap,
    Target,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { getLocalizedPaths } from "@/lib/paths";

export default async function Home({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <Link
                        href={PATHS.DASHBOARD.ROOT}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/cat-smiling.svg"
                            width={36}
                            height={36}
                            alt="Level Up Journey Pet Smiling"
                            className="rounded-md"
                        />
                        <span className="font-semibold text-lg tracking-tight">
                            Level Up Journey
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Button variant="ghost" asChild>
                            <Link href={PATHS.AUTH.SIGN_IN}>
                                Sign In
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={PATHS.AUTH.SIGN_UP.ROOT}>
                                Register
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-4 sm:px-6">
                <section className="py-16 md:py-24 text-center">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
                            <span className="text-sm font-medium text-foreground">
                                Your tech future starts here
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-tight">
                            Learn to code
                            <br />
                            <span className="text-primary">by doing</span>
                        </h1>

                        <div className="text-xl sm:text-2xl md:text-3xl font-semibold h-12 flex items-center justify-center">
                            <TypingAnimation
                                words={[
                                    "JavaScript",
                                    "Python",
                                    "Java",
                                    "React",
                                    "Node.js",
                                    "C++",
                                    "SQL",
                                    "TypeScript",
                                ]}
                                className="text-muted-foreground"
                                typeSpeed={100}
                                deleteSpeed={50}
                                pauseDelay={2000}
                                loop={true}
                            />
                        </div>

                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Real challenges. Practical projects. No boring theory. Learn programming like professionals do.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-6">
                            <Button
                                size="lg"
                                className="text-base h-12 w-full sm:w-auto"
                                asChild
                            >
                                <Link href={PATHS.AUTH.SIGN_UP.ROOT}>
                                    Start for free
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Quick Stats */}
                <section className="py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <div className="text-center space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-foreground">
                                10+
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Languages
                            </p>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-foreground">
                                500+
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Challenges
                            </p>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-foreground">
                                1K+
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Students
                            </p>
                        </div>
                        <div className="text-center space-y-1">
                            <div className="text-3xl md:text-4xl font-bold text-foreground">
                                24/7
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                Community
                            </p>
                        </div>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* Features Section */}
                <section className="py-12">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
                            Why choose us?
                        </h2>
                        <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                            Everything you need to launch your tech career
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                            <CardContent className="pt-6 space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Learn fast
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Short, practical challenges. Instant feedback. No wasted time.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                            <CardContent className="pt-6 space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Practical focus
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Real projects from day one. Learn what companies actually use.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                            <CardContent className="pt-6 space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Active community
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Share code, solve questions, and learn with other students.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                            <CardContent className="pt-6 space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Trophy className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Gamification
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Earn points, unlock achievements, and compete in global rankings.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                            <CardContent className="pt-6 space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Learning paths
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Follow a structured path from beginner to advanced.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50">
                            <CardContent className="pt-6 space-y-3">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Code2 className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold">
                                    Integrated editor
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Write, test, and run code directly in your browser.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Separator className="my-12" />

                {/* CTA Section */}
                <section className="py-16 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                            Ready for your first challenge?
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                            Thousands of students are already learning. Join for free and start building your tech future.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Button
                                size="lg"
                                className="text-base h-12 w-full sm:w-auto"
                                asChild
                            >
                                <Link href={PATHS.AUTH.SIGN_UP.ROOT}>
                                    Create free account
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-base h-12 w-full sm:w-auto"
                                asChild
                            >
                                <Link href={PATHS.DASHBOARD.CHALLENGES.ROOT}>
                                    Explore content
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t mt-16">
                <div className="container mx-auto px-4 sm:px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                © 2025 Level Up Journey
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Shaping the next generation of developers
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
