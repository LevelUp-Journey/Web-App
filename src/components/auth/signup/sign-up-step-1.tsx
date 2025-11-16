"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { Google } from "@/components/ui/svgs/google";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";
import type { Dictionary } from "@/lib/i18n";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

interface SignUpStep1Props {
    dict?: Dictionary;
}

export default function SignUpStep1({ dict }: SignUpStep1Props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showEmailForm, setShowEmailForm] = useState(false);

    const router = useRouter();
    const PATHS = useLocalizedPaths();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error(
                dict?.auth.signUp.step1.passwordMismatch ||
                    "Passwords do not match",
            );
            return;
        }

        try {
            const response = await AuthController.signUp({
                email,
                password,
            });

            if (response.token) {
                const redirection = PATHS.AUTH.SIGN_UP.STEP(2);
                router.push(redirection);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h1 className="mb-4 text-2xl font-semibold">
                {dict?.auth.signUp.step1.title || "Sign Up"}
            </h1>

            {!showEmailForm ? (
                <div className="flex flex-col gap-4">
                    <Button
                        type="button"
                        className="w-full"
                        onClick={() => setShowEmailForm(true)}
                    >
                        {dict?.auth.signUp.step1.continueWithEmail ||
                            "Continue with Email"}
                    </Button>

                    <Separator
                        orientation="horizontal"
                        className="my-6 flex justify-center items-center text-sm"
                    >
                        {dict?.auth.signUp.step1.orSeparator || "Or"}
                    </Separator>

                    <ul className="flex flex-col gap-2">
                        <li>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    AuthController.signInWithGoogle()
                                }
                            >
                                <Google />{" "}
                                {dict?.auth.signUp.step1.continueWithGoogle ||
                                    "Continue with Google"}
                            </Button>
                        </li>

                        <li>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() =>
                                    AuthController.signInWithGithub()
                                }
                            >
                                <GithubDark />
                                <GithubLight />
                                {dict?.auth.signUp.step1.continueWithGithub ||
                                    "Continue with Github"}
                            </Button>
                        </li>
                    </ul>
                </div>
            ) : (
                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={
                            dict?.auth.signUp.step1.emailPlaceholder || "Email"
                        }
                        required
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={
                            dict?.auth.signUp.step1.passwordPlaceholder ||
                            "Password"
                        }
                        required
                    />
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={
                            dict?.auth.signUp.step1
                                .confirmPasswordPlaceholder ||
                            "Confirm Password"
                        }
                        required
                    />
                    <Button type="submit" className="w-full">
                        {dict?.auth.signUp.step1.nextButton || "Next"}
                    </Button>
                </form>
            )}

            <p className="text-sm mt-4">
                {dict?.auth.signUp.step1.haveAccount ||
                    "If you already have an account,"}{" "}
                <Link href={PATHS.AUTH.SIGN_IN}>
                    {dict?.auth.signUp.step1.signInLink || "Sign in"}
                </Link>
            </p>
        </>
    );
}
