import React from "react";

type Rank = {
  id: number;
  name: string;
  file: string;
};

const RANKS: Rank[] = [
  { id: 1, name: "Bronze", file: "/ranks-trophy/1Bronze.svg" },
  { id: 2, name: "Silver", file: "/ranks-trophy/2Silver.svg" },
  { id: 3, name: "Gold", file: "/ranks-trophy/3Gold.svg" },
  { id: 4, name: "Platinium", file: "/ranks-trophy/4Platinium.svg" },
  { id: 5, name: "Diamond", file: "/ranks-trophy/5Diamond.svg" },
  { id: 6, name: "Master", file: "/ranks-trophy/6Master.svg" },
  { id: 7, name: "Grandmaster", file: "/ranks-trophy/7Grandmaster.svg" },
];

export function RanksList({ className = "" }: { className?: string }) {
  return (
    <section className={"w-full " + className} aria-labelledby="ranks-heading">
      <h2 id="ranks-heading" className="text-lg font-semibold mb-4">
        Ranking System
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
        {RANKS.map((rank) => (
          <div key={rank.id} className="flex flex-col items-center text-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 p-2 rounded-md bg-muted/10 flex items-center justify-center">
              {/* Using plain img so Next.js will serve from /public */}
              <img src={rank.file} alt={`${rank.name} trophy`} className="max-w-full max-h-full" />
            </div>
            <span className="mt-2 text-xs sm:text-sm font-medium uppercase tracking-wider">
              {rank.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default RanksList;
