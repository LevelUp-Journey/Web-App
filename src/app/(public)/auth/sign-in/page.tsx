"use client";
import Link from "next/link";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { Google } from "@/components/ui/svgs/google";
import { PATHS } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function SignInPage() {
    const handleSignIn = async (formData: FormData) => {
        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            await AuthController.signIn({ email, password });

            redirect(PATHS.DASHBOARD.ROOT);
        } catch {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            <h1 className="mb-4 text-2xl font-semibold">
                Sign in to Level Up Journey
            </h1>
            <form action={handleSignIn}>
                <div className="mb-4">
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Sign In
                </Button>
            </form>

            <Separator
                orientation="horizontal"
                className="my-6 flex justify-center items-center text-sm"
            >
                Or
            </Separator>

            <ul className="flex flex-col gap-2">
                <li>
                    <Button variant={"outline"} className="w-full">
                        <Google /> Continue with Google
                    </Button>
                </li>

                <li>
                    <Button variant={"outline"} className="w-full">
                        <GithubDark />
                        <GithubLight />
                        Continue with Github
                    </Button>
                </li>
            </ul>
            <p className="text-sm mt-4">
                Don't have an account?{" "}
                <Link href={PATHS.AUTH.SIGN_UP.ROOT}>Sign up</Link>
            </p>
        </div>
    );
}
