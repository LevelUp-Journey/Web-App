import Link from "next/link";
import { getLocalizedPaths } from "@/lib/paths";

export default async function Home({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const PATHS = getLocalizedPaths(lang);

    return (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <Link href={PATHS.AUTH.SIGN_IN}>Login</Link>
            <Link href={PATHS.AUTH.SIGN_UP.ROOT}>Sign Up</Link>
        </div>
    );
}
