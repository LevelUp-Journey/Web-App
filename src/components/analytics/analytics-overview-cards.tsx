import { BarChart3, Languages, Users } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface AnalyticsOverviewCardsProps {
    totalUsers: number;
    totalExecutions: number;
    activeLanguages: number;
    lang: string;
}

export function AnalyticsOverviewCards({
    totalUsers,
    totalExecutions,
    activeLanguages,
    lang,
}: AnalyticsOverviewCardsProps) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {lang === "es" ? "Total de Usuarios" : "Total Users"}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        {lang === "es"
                            ? "Usuarios registrados"
                            : "Registered users"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {lang === "es" ? "Total de Envíos" : "Total Submissions"}
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalExecutions}</div>
                    <p className="text-xs text-muted-foreground">
                        {lang === "es" ? "Últimos 30 días" : "Last 30 days"}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {lang === "es"
                            ? "Lenguajes Activos"
                            : "Active Languages"}
                    </CardTitle>
                    <Languages className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{activeLanguages}</div>
                    <p className="text-xs text-muted-foreground">
                        {lang === "es"
                            ? "Lenguajes en uso"
                            : "Languages in use"}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
