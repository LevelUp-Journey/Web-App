import { signUpAction } from "@/services/iam/server/auth.actions";

export default function SignUpPage() {
    async function handleSignUp(formData: FormData) {
        "use server";
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        await signUpAction({ email, password });
    }

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form action={handleSignUp}>
                <div className="mb-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 w-full"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
