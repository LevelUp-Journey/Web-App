"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChallengeController } from "@/services/internal/challenges/controller/challenge.controller";

interface PublishButtonProps {
    challengeId: string;
}

export default function PublishButton({ challengeId }: PublishButtonProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const router = useRouter();

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await ChallengeController.publishChallenge(challengeId);
            toast.success("Challenge published successfully!");
            router.refresh();
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <Button
            onClick={handlePublish}
            disabled={isPublishing}
            variant="default"
        >
            {isPublishing ? "Publishing..." : "Publish Challenge"}
        </Button>
    );
}
