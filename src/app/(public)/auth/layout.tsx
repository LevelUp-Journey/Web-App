import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/paths";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-dvh flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-2">
                    <Image
                        src="/pet_smile.png"
                        width={36}
                        height={36}
                        alt="Level Up Journey Pet Smiling"
                        className="rounded-md"
                    />
                    <span className="font-semibold text-lg tracking-tight">
                        Level Up Journey
                    </span>
                </div>

                <Button variant="outline" size="sm">
                    Iniciar sesión
                </Button>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-md p-8 rounded-xl shadow-sm">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="flex justify-center gap-4 py-4 border-t text-sm">
                <Link href={PATHS.LEGAL.TERMS}>Términos</Link>
                <Link href={PATHS.LEGAL.PRIVACY_POLICY}>
                    Política de Privacidad
                </Link>
            </footer>
        </div>
    );
}
