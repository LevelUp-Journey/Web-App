import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { LanguageKPI } from "@/services/internal/analytics/entities/analytics.entity";

interface LanguageKPIsCardProps {
    languageKPIs: LanguageKPI[];
    lang: string;
}

export function LanguageKPIsCard({ languageKPIs, lang }: LanguageKPIsCardProps) {
    if (languageKPIs.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {lang === "es"
                        ? "Métricas de Rendimiento"
                        : "Performance Metrics"}
                </CardTitle>
                <CardDescription>
                    {lang === "es"
                        ? "Métricas por lenguaje de programación"
                        : "Metrics by programming language"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {languageKPIs.map((languageKPI, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between border-b pb-2 last:border-0"
                        >
                            <div>
                                <p className="font-medium">
                                    {languageKPI.language}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {languageKPI.total_executions || 0}{" "}
                                    {lang === "es" ? "ejecuciones" : "executions"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm">
                                    {languageKPI.success_rate
                                        ? `${languageKPI.success_rate.toFixed(1)}%`
                                        : "N/A"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {lang === "es" ? "Tasa de éxito" : "Success rate"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
