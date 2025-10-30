"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";
import { RanksList } from "./ranks-list";
import { RankingOverview } from "./ranking-overview";
import { RanksByScore } from "./ranks-by-score";
import { GeneralRules } from "./general-rules";
import { Penalization } from "./penalization";

export function RanksTabContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <RanksList />
      <RankingOverview />
      <RanksByScore />
      <GeneralRules />
      <Penalization />
    </div>
  );
}
