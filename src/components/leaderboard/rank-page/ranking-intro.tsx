import type { Dictionary } from "@/app/[lang]/dictionaries";

export function RankingIntro({
    className = "",
    dict,
}: {
    className?: string;
    dict: Dictionary;
}) {
    return (
        <section className={`w-full ${className}`}>
            <h1 className="text-3xl font-bold mb-6">
                {dict.leaderboard.rankingSystem.overview.title}
            </h1>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                <p className="leading-relaxed">
                    {/* @ts-ignore - intro will be available after i18n update */}
                    <strong>{dict.leaderboard.rankingSystem.overview.intro?.howItWorks || "¿Cómo funcionan los rangos?"}</strong> {dict.leaderboard.rankingSystem.overview.intro?.simple || "Completas desafíos, ganas puntos, subes de rango. Simple."}
                </p>
                <p className="leading-relaxed">
                    {/* @ts-ignore - intro will be available after i18n update */}
                    {dict.leaderboard.rankingSystem.overview.intro?.explanation || "Cada desafío tiene puntos máximos según su dificultad. Tu tiempo de resolución determina qué porcentaje de esos puntos recibes (20% a 100%). Todos los tests deben pasar para ganar puntos, si alguno falla obtienes 0."}
                </p>
            </div>
        </section>
    );
}

export default RankingIntro;
