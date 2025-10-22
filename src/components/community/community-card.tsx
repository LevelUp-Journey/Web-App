"use client";

import { useRouter } from "next/navigation";
import type { Community } from "@/services/internal/community/entities/community.entity";
import { Card, CardContent } from "@/components/ui/card";

interface CommunityCardProps {
    community: Community;
    username?: string;
}

export function CommunityCard({ community, username }: CommunityCardProps) {
    const router = useRouter();

    return (
        <Card 
            className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col"
            onClick={() => router.push(`/dashboard/community/edit?id=${community.id}`)}
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

                {/* Footer con creador y fecha */}
                <div className="pt-4 border-t flex items-center justify-between text-xs text-muted-foreground mt-auto">
                    <span className="font-medium">
                        By <span className="text-foreground">{username || "Usuario"}</span>
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
    );
}

export default CommunityCard;