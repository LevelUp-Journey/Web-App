"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { Spinner } from "@/components/ui/spinner";
import { AuthController } from "@/services/iam/controller/auth.controller";

export default function SignUpStep2() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setPhotoFile(files[0]);
        }
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const email = localStorage.getItem('signup_email');
        const password = localStorage.getItem('signup_password');
        if (!email || !password) {
            alert("Missing email or password");
            setLoading(false);
            return;
        }
        await AuthController.signUp({ email, password });
        // TODO: Update profile with name and photo if API supports
        setLoading(false);
    };

    return <form onSubmit={handleSignUp} className="flex flex-col gap-4">

        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <div className="flex flex-col items-center gap-4">
            <Avatar className="size-20">
                {photoFile ? (
                    <AvatarImage src={URL.createObjectURL(photoFile)} />
                ) : (
                    <AvatarFallback>?</AvatarFallback>
                )}
            </Avatar>
            <Dropzone
                accept={{ 'image/*': [] }}
                maxFiles={1}
                maxSize={1024 * 1024 * 10}
                onDrop={handleDrop}
                onError={console.error}
            >
                <DropzoneEmptyState />
                <DropzoneContent />
            </Dropzone>
        </div>
        <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => router.push('/auth/sign-up?step=1')} className="flex-1">
                Back
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? (
                    <>
                        <Spinner /> Creating...
                    </>
                ) : (
                    "Sign Up"
                )}
            </Button>
        </div>
    </form>
}
