import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Image src="/pet_sad.png" alt="Logo" width={100} height={100} />
            <h1 className="text-4xl font-bold mb-4">Unauthorized</h1>
            <p className="text-lg mb-8">
                You do not have permission to access this page.
            </p>
            <Link href="/">
                <Button className="font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                    Go Back Home
                </Button>
            </Link>
        </div>
    );
}
