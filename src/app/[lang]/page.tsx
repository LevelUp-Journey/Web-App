import { ArrowRight, BookOpen, Code2, Play, Trophy, Users } from "lucide-react";
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
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href={PATHS.DASHBOARD.ROOT}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <Image
                            src="/pet_smile.png"
                            width={40}
                            height={40}
                            alt="Level Up Journey"
                            className="rounded-md"
                        />
                        <span className="text-2xl font-bold text-foreground">
                            Level Up Journey
                        </span>
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <Link href={PATHS.AUTH.SIGN_IN}>Login</Link>
                        </Button>
                        <Button asChild>
                            <Link href={PATHS.AUTH.SIGN_UP.ROOT}>
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="container mx-auto px-6">
                <section className="py-20 md:py-32 text-center">
                    <div className="max-w-4xl mx-auto space-y-8">
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
                                Master Programming
                            </h1>
                            <div className="text-2xl md:text-4xl font-semibold h-16 flex items-center justify-center min-h-[4rem]">
                                <TypingAnimation
                                    words={[
                                        "JavaScript",
                                        "Python",
                                        "Java",
                                        "C++",
                                        "React",
                                        "Node.js",
                                        "AI & ML",
                                        "Web Development",
                                    ]}
                                    className="text-muted-foreground"
                                    typeSpeed={100}
                                    deleteSpeed={50}
                                    pauseDelay={2000}
                                    loop={true}
                                />
                            </div>
                            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Embark on an interactive journey to learn
                                programming through hands-on challenges,
                                real-world projects, and comprehensive
                                tutorials.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button
                                size="lg"
                                className="text-base h-12"
                                asChild
                            >
                                <Link href={PATHS.AUTH.SIGN_UP.ROOT}>
                                    <Play className="mr-2 h-5 w-5" />
                                    Start Learning Now
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="text-base h-12"
                                asChild
                            >
                                <Link href={PATHS.DASHBOARD.CHALLENGES.ROOT}>
                                    Explore Challenges
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                <Separator className="my-16" />

                {/* Features Section */}
                <section className="py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Why Choose Level Up Journey?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Everything you need to accelerate your programming
                            journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <Card className="border-2 hover:border-primary transition-colors">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <BookOpen className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Interactive Learning
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Learn by doing with coding challenges,
                                    instant feedback, and step-by-step guidance.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-primary transition-colors">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Users className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Community Driven
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Join a vibrant community of learners, share
                                    solutions, and learn from peers.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-2 hover:border-primary transition-colors">
                            <CardContent className="pt-6 text-center space-y-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                    <Trophy className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">
                                    Track Progress
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Earn points, unlock achievements, and climb
                                    the leaderboards as you improve.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <Separator className="my-16" />

                {/* Stats Section */}
                <section className="py-16">
                    <Card className="border-2">
                        <CardContent className="pt-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-primary">
                                        10+
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Programming Languages
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-primary">
                                        500+
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Coding Challenges
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-primary">
                                        1000+
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Active Students
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-4xl md:text-5xl font-bold text-primary">
                                        24/7
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">
                                        Community Support
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t mt-20">
                <div className="container mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" />
                            <span className="text-sm text-muted-foreground">
                                &copy; 2024 Level Up Journey
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Empowering developers worldwide
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
