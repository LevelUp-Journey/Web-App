import { Suspense } from "react";
import SignUpStep1 from "@/components/auth/signup/sign-up-step-1";
import SignUpStep2 from "@/components/auth/signup/sign-up-step-2";
import SignUpStep3 from "@/components/auth/signup/sign-up-step-3";

export default async function SignUpPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;
    const value = params.step || "1";
    const step = parseInt(value, 10);

    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            {step === 1 ? (
                <SignUpStep1 />
            ) : step === 2 ? (
                <SignUpStep2 />
            ) : step === 3 ? (
                <Suspense
                    fallback={
                        <div className="text-center py-8">
                            Loading your profile...
                        </div>
                    }
                >
                    <SignUpStep3 />
                </Suspense>
            ) : (
                <div className="text-center py-8">Invalid step</div>
            )}
        </div>
    );
}
