import { Button } from "@/components/ui/button";
import { PATHS } from "@/lib/paths";
import Link from "next/link";

export default function CreateGuidePage() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Create Guide</h2>
                <Button asChild>
                    <Link href={PATHS.DASHBOARD.GUIDES}>Cancel</Link>
                </Button>
            </div>
            <div className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="content" className="text-sm font-medium">
                        Content
                    </label>
                    <textarea
                        id="content"
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </div>
            </div>
            <div className="flex justify-end">
                <Button type="submit">Create</Button>
            </div>
        </div>
    );
}
