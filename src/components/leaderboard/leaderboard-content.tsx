import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LeaderboardContent() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        Aquí se mostrará el leaderboard con los usuarios y sus posiciones.
                    </p>
                    {/* TODO: Implementar leaderboard real con hooks existentes */}
                </CardContent>
            </Card>
        </div>
    );
}