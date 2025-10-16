"use client";

import { UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dropzone,
    DropzoneContent,
    DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { Spinner } from "@/components/ui/spinner";
import { useUser } from "@/hooks/user-user";
import { ProfileController } from "@/services/internal/profiles/controller/profile.controller";

export default function SignUpStep2() {
    const [name, setName] = useState("");
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const { userId, setUser} = useUser();

    const handleDrop = (files: File[]) => {
        if (files.length > 0) {
            setPhotoFile(files[0]);
        }
    };

    const onProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        setLoading(false);
    };


    useEffect(() => {
        setUser({userId: userId})
    }, [userId])

    useEffect(() => {
        console.log("User ", userId);
        if (userId) {
            ProfileController.getProfileByUserId(userId).then((profile) => {
                console.log("PROFILE", profile);
                setName(profile.username);
            });
            return;
        }
        toast.error("Error to get auto created user profile");
        // redirect(PATHS.AUTH.SIGN_UP.ROOT);
    }, []);

    return (
        <form onSubmit={onProfileUpdate} className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4">
                <Avatar className="size-20">
                    {photoFile ? (
                        <AvatarImage src={URL.createObjectURL(photoFile)} />
                    ) : (
                        <AvatarFallback>
                            <UserCircle2 size={48} />
                        </AvatarFallback>
                    )}
                </Avatar>
                <div className="relative w-full">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="w-full"
                        required
                    />
                    <p className="block text-xs mt-1 absolute text-muted-foreground">
                        By default we create a name for you
                    </p>
                </div>
            </div>
            <Dropzone
                accept={{ "image/*": [] }}
                maxFiles={1}
                maxSize={1024 * 1024 * 10}
                onDrop={handleDrop}
                onError={() => toast.error("Error uploading photo")}
            >
                <DropzoneEmptyState />
                <DropzoneContent />
            </Dropzone>
            <div className="flex gap-2">
                <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? (
                        <>
                            <Spinner /> Creating...
                        </>
                    ) : (
                        "Start your adventure"
                    )}
                </Button>
            </div>
        </form>
    );
}
