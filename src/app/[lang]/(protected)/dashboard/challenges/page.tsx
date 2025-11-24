"use client";

import { useState } from "react";
import { ChallengesPageSection } from "@/components/challenges/challenges-page-section";
import { SearchInput } from "@/components/searching/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { useDictionary } from "@/hooks/use-dictionary";

export default function ChallengesPage() {
  const [challengesCount, setChallengesCount] = useState<number | null>(null);
  const dict = useDictionary();

  return (
    <div className="container mx-auto px-4 pt-16 pb-8 space-y-6">
      {/* Inspirational Header */}
      <div className="text-center max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl text-balance md:text-5xl font-medium text-foreground mb-6 leading-tight h-16 flex items-center justify-center">
          <TypingAnimation
            children={
              dict?.challengesPage.header.title || "Start coding with purpose"
            }
            className="text-foreground"
            typeSpeed={100}
            deleteSpeed={50}
            delay={500}
            pauseDelay={2000}
            loop={false}
            showCursor={true}
            blinkCursor={true}
            cursorStyle="line"
          />
        </h1>
        <p className="text-base text-pretty md:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
          {dict?.challengesPage.header.description}
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center">
        <SearchInput placeholder={dict?.common?.search} />
      </div>

      {/* Header Section */}
      <header className="space-y-2">
        <h2 className="text-3xl font-medium tracking-tight">
          {dict?.challengesPage.section.title}
        </h2>
        {challengesCount !== null && (
          <p className="text-base text-muted-foreground">
            {challengesCount}{" "}
            {challengesCount === 1
              ? dict?.challengesPage.section.results.singular
              : dict?.challengesPage.section.results.plural}
          </p>
        )}
      </header>

      {/* Challenges Grid */}
      <ChallengesPageSection onCountChange={setChallengesCount} />
    </div>
  );
}
