"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/hooks/use-dictionary";
import { ChallengeController } from "@/services/internal/challenges/challenge/controller/challenge.controller";

interface PublishButtonProps {
    challengeId: string;
}

export default function PublishButton({ challengeId }: PublishButtonProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const router = useRouter();
    const dict = useDictionary();

    const handlePublish = async () => {
        setIsPublishing(true);
        try {
            await ChallengeController.publishChallenge(challengeId);
            toast.success(
                dict?.challenges?.messages?.challengePublished ||
                    "Challenge published successfully!",
            );
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
            {isPublishing
                ? dict?.challenges?.buttons?.publishing || "Publishing..."
                : dict?.challenges?.buttons?.publishChallenge ||
                  "Publish Challenge"}
        </Button>
    );
}
