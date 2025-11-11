import { Suspense } from "react";
import SignUpStep1 from "@/components/auth/signup/sign-up-step-1";
import SignUpStep2 from "@/components/auth/signup/sign-up-step-2";
import SignUpStep3 from "@/components/auth/signup/sign-up-step-3";
import { getDictionary } from "@/lib/i18n";

export default async function SignUpPage({
    params,
    searchParams,
}: {
    params: Promise<{ lang: string }>;
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang as "en" | "es");
    const params_search = await searchParams;
    const value = params_search.step || "1";
    const step = parseInt(value, 10);

    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            {step === 1 ? (
                <SignUpStep1 dict={dict} />
            ) : step === 2 ? (
                <SignUpStep2 dict={dict} />
            ) : step === 3 ? (
                <Suspense
                    fallback={
                        <div className="text-center py-8">
                            {dict?.auth.signUp.step3.loadingProfile ||
                                "Loading your profile..."}
                        </div>
                    }
                >
                    <SignUpStep3 dict={dict} />
                </Suspense>
            ) : (
                <div className="text-center py-8">
                    {dict?.auth.signUp.step3.invalidStep || "Invalid step"}
                </div>
            )}
        </div>
    );
}
