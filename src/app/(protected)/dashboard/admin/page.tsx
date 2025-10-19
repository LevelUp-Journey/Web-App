import { Button } from "@/components/ui/button";

export default function AdministrativeDashboardPage() {
    return (
        <div className="container py-4 mx-auto">
            {/* Welcome Message */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome to the Administrative Panel
                </h1>
                <p>Manage challenges and platform content from here.</p>
            </div>

            {/* Challenges Section */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">Challenges</h2>
                    <Button className="font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                        Create Challenge
                    </Button>
                </div>
            </div>
        </div>
    );
}
