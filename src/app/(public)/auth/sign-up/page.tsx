"use client";
import { useSearchParams } from "next/navigation";
import SignUpStep1 from "@/components/auth/signup/sign-up-step-1";
import SignUpStep2 from "@/components/auth/signup/sign-up-step-2";

export default function SignUpPage() {
    const searchParams = useSearchParams();
    const param = searchParams.get("step");

    const step = parseInt(param || "1", 10);

    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            {step === 1 ? (
                <SignUpStep1 />
            ) : step === 2 ? (
                <SignUpStep2 />
            ) : (
                <div>Invalid step</div>
            )}
        </div>
    );
}
