"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocalizedPaths } from "@/hooks/use-localized-paths";

// Validation schema for names (firstName and lastName)
const nameSchema = z
    .string()
    .trim()
    .min(1, "Name cannot be empty")
    .max(20, "Name cannot exceed 20 characters")
    .regex(
        /^[A-Za-zÁáÉéÍíÓóÚúÑñÜü\s-]+$/,
        "Name must contain only letters, accents, spaces, and hyphens, with maximum 20 characters",
    );

const formSchema = z.object({
    firstName: nameSchema,
    lastName: nameSchema,
});

type FormData = z.infer<typeof formSchema>;

export default function SignUpStep2() {
    const router = useRouter();
    const PATHS = useLocalizedPaths();
    const [loading, setLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = form;

    const onSubmit = async (data: FormData) => {
        setLoading(true);

        try {
            // Store the names in localStorage for the next step
            localStorage.setItem("signup_firstName", data.firstName);
            localStorage.setItem("signup_lastName", data.lastName);

            // Navigate to step 3
            const redirection = PATHS.AUTH.SIGN_UP.STEP(3);
            router.push(redirection);
        } catch (error) {
            console.error("Error saving names:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        const redirection = PATHS.AUTH.SIGN_UP.STEP(1);
        router.push(redirection);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="mb-2 text-2xl font-semibold">
                    Tell Us About Yourself
                </h1>
                <p className="text-sm text-muted-foreground">
                    Enter your first and last name to continue
                </p>
            </div>

            {/* First Name Input */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                </Label>
                <Input
                    id="firstName"
                    type="text"
                    placeholder="Enter your first name"
                    disabled={loading}
                    autoFocus
                    {...register("firstName")}
                />
                {errors.firstName && (
                    <p className="text-sm text-destructive">
                        {errors.firstName.message}
                    </p>
                )}
            </div>

            {/* Last Name Input */}
            <div className="flex flex-col gap-2">
                <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                </Label>
                <Input
                    id="lastName"
                    type="text"
                    placeholder="Enter your last name"
                    disabled={loading}
                    {...register("lastName")}
                />
                {errors.lastName && (
                    <p className="text-sm text-destructive">
                        {errors.lastName.message}
                    </p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
                <Button
                    type="submit"
                    disabled={loading || !isValid}
                    size="lg"
                    className="w-full"
                >
                    {loading ? "Saving..." : "Continue"}
                </Button>

                <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                >
                    Back
                </Button>
            </div>
        </form>
    );
}
