"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PATHS } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function SignUpStep1() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
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
            <h1 className="mb-4 text-2xl font-semibold">Sign Up</h1>

            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                <Button type="submit" className="w-full">
                    Next
                </Button>
            </form>

            <p className="text-sm mt-4">
                If you already have an account,{" "}
                <Link href={PATHS.AUTH.SIGN_IN}>Sign in</Link>
            </p>
        </>
    );
}
