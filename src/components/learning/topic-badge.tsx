import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TopicBadgeProps {
    topic: {
        id: string;
        name: string;
    };
    className?: string;
    onRemove?: () => void;
}

export function TopicBadge({ topic, className, onRemove }: TopicBadgeProps) {
    return (
        <Badge
            variant="secondary"
            className={cn(
                "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-100",
                onRemove && "pr-1",
                className,
            )}
        >
            {topic.name}
            {onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-1 rounded-full hover:bg-purple-300 dark:hover:bg-purple-700 p-0.5"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            )}
        </Badge>
    );
}
