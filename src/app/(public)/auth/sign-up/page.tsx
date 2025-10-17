"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { AuthController } from "@/services/iam/controller/auth.controller";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            // TODO: Implement sign-up logic (API call)
            AuthController.signUp({ email, password });
            toast.success("Account created successfully!");
        } catch (err) {
            toast.error("Error creating account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            <h1 className="mb-4 text-2xl font-semibold">Sign Up</h1>

            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <Input type="email" name="email" placeholder="Email" required />
                <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                />
                <Input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    required
                />
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner /> Creating...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </form>
        </div>
    );
}
