"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/paths";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const buttonMessage =
        pathname === PATHS.AUTH.SIGN_IN ? "Sign Up" : "Sign In";

    const buttonHref =
        pathname === PATHS.AUTH.SIGN_IN
            ? PATHS.AUTH.SIGN_UP.ROOT
            : PATHS.AUTH.SIGN_IN;

    return (
        <div className="min-h-dvh flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
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
                </div>

                <Button variant="outline" size="sm" asChild>
                    <Link href={buttonHref} suppressHydrationWarning>
                        {buttonMessage}
                    </Link>
                </Button>
            </header>

            {/* Main Content */}
            <main className="grow flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md p-8 rounded-xl shadow-sm">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="flex justify-center gap-4 py-4 text-sm">
                <Link href={PATHS.LEGAL.TERMS}>Terms</Link>
                <Link href={PATHS.LEGAL.PRIVACY_POLICY}>Privacy Policy</Link>
            </footer>
        </div>
    );
}
