import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Community } from "@/services/internal/community/entities/community.entity";

interface CommunitySelectorProps {
    communities: Community[];
    usernames: Record<string, string>;
    onSelectCommunity: (community: Community) => void;
}

export function CommunitySelector({ communities, usernames, onSelectCommunity }: CommunitySelectorProps) {
    const router = useRouter();

    if (communities.length === 0) {
        return (
            <Card>
                <CardContent className="p-8 text-center">
                    <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No communities available</h3>
                    <p className="text-muted-foreground mb-4">
                        Create a community first to start posting.
                    </p>
                    <Button onClick={() => router.push("/dashboard/community/create")}>
                        Create Community
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {communities.map((community) => (
                <Card
                    key={community.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
                    onClick={() => onSelectCommunity(community)}
                >
                    {/* Banner */}
                    <div className="w-full h-48 overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5">
                        {community.imageUrl ? (
                            <img
                                src={community.imageUrl}
                                alt={`${community.name} banner`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-6xl font-bold text-primary/20">
                                    {community.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    <CardContent className="p-6 space-y-4 flex-1 flex flex-col">
                        {/* Nombre de la comunidad */}
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                            {community.name}
                        </h3>

                        {/* Descripción */}
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed flex-1">
                            {community.description}
                        </p>

                        {/* Footer con creador */}
                        <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground mt-auto">
                            <span className="font-medium">
                                By <span className="text-foreground">{usernames[community.ownerId] || "Unknown User"}</span>
                            </span>
                            <span>
                                {new Date(community.createdAt).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                })}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}