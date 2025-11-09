"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { Google } from "@/components/ui/svgs/google";
import { useDictionary } from "@/hooks/use-dictionary";
import { PATHS } from "@/lib/paths";
import { AuthController } from "@/services/internal/iam/controller/auth.controller";

export default function SignInPage() {
    const router = useRouter();
    const dict = useDictionary();

    const handleSignIn = async (formData: FormData) => {
        try {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            await AuthController.signIn({ email, password });
            router.push(PATHS.DASHBOARD.ROOT);
        } catch {
            toast.error(dict?.auth.signIn.error || "Something went wrong");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md text-center">
            <h1 className="mb-4 text-2xl font-semibold">
                {dict?.auth.signIn.title || "Sign in to Level Up Journey"}
            </h1>
            <form action={handleSignIn}>
                <div className="mb-4">
                    <Input
                        type="email"
                        name="email"
                        placeholder={
                            dict?.auth.signIn.emailPlaceholder || "Email"
                        }
                        required
                    />
                </div>
                <div className="mb-4">
                    <Input
                        type="password"
                        name="password"
                        placeholder={
                            dict?.auth.signIn.passwordPlaceholder || "Password"
                        }
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    {dict?.auth.signIn.submitButton || "Sign In"}
                </Button>
            </form>

            <Separator
                orientation="horizontal"
                className="my-6 flex justify-center items-center text-sm"
            >
                {dict?.auth.signIn.orSeparator || "Or"}
            </Separator>

            <ul className="flex flex-col gap-2">
                <li>
                    <Button
                        variant={"outline"}
                        className="w-full"
                        onClick={() => AuthController.signInWithGoogle()}
                    >
                        <Google />{" "}
                        {dict?.auth.signIn.continueWithGoogle ||
                            "Continue with Google"}
                    </Button>
                </li>

                <li>
                    <Button
                        variant={"outline"}
                        className="w-full"
                        onClick={() => AuthController.signInWithGithub()}
                    >
                        <GithubDark />
                        <GithubLight />
                        {dict?.auth.signIn.continueWithGithub ||
                            "Continue with Github"}
                    </Button>
                </li>
            </ul>
            <p className="text-sm mt-4">
                {dict?.auth.signIn.noAccount || "Don't have an account?"}{" "}
                <Link href={PATHS.AUTH.SIGN_UP.ROOT}>
                    {dict?.auth.signIn.signUpLink || "Sign up"}
                </Link>
            </p>
        </div>
    );
}
