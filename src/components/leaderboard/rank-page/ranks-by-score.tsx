import Image from "next/image";

type RankItem = {
  key: string;
  name: string;
  file: string;
  range: string;
};

const RANKS: RankItem[] = [
  { key: "bronze", name: "Bronze", file: "/ranks/rank-bronze.svg", range: "0 – 499" },
  { key: "silver", name: "Silver", file: "/ranks/rank-silver.svg", range: "500 – 899" },
  { key: "gold", name: "Gold", file: "/ranks/rank-gold.svg", range: "900 – 1149" },
  { key: "platinum", name: "Platinum", file: "/ranks/rank-platinum.svg", range: "1150 – 1299" },
  { key: "diamond", name: "Diamond", file: "/ranks/rank-diamond.svg", range: "1300 – 1399" },
  { key: "master", name: "Master", file: "/ranks/rank-master.svg", range: "1400 – 1499" },
  { key: "grandmaster", name: "Grandmaster", file: "/ranks/rank-grandmaster.svg", range: "1500 +" },
];

export function RanksByScore({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full ${className}`} aria-label="Ranks by score">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end">
        {RANKS.map((r) => (
          <div key={r.key} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 p-1 rounded-md flex items-center justify-center">
              <Image src={r.file} alt={`${r.name} rank`} width={96} height={96} className="max-w-full max-h-full" unoptimized />
            </div>
            <div className="mt-2 text-sm font-medium">{r.name}</div>
            <div className="text-xs text-muted-foreground mt-1">{r.range}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RanksByScore;
