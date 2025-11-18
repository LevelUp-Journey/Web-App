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

      {/* Filters */}
      <div className="flex justify-center gap-4 flex-wrap">
        <Select>
          <SelectTrigger>
            <SelectValue
              placeholder={dict?.challengesPage.filters.difficulty}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">
              {dict?.challengesPage.filters.difficultyOptions.easy}
            </SelectItem>
            <SelectItem value="medium">
              {dict?.challengesPage.filters.difficultyOptions.medium}
            </SelectItem>
            <SelectItem value="hard">
              {dict?.challengesPage.filters.difficultyOptions.hard}
            </SelectItem>
            <SelectItem value="expert">
              {dict?.challengesPage.filters.difficultyOptions.expert}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue placeholder={dict?.challengesPage.filters.language} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="c++">
              {dict?.challengesPage.filters.languageOptions.cpp}
            </SelectItem>
            <SelectItem value="python">
              {dict?.challengesPage.filters.languageOptions.python}
            </SelectItem>
            <SelectItem value="javascript">
              {dict?.challengesPage.filters.languageOptions.javascript}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue
              placeholder={dict?.challengesPage.filters.popularity}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="most-popular">
              {dict?.challengesPage.filters.popularityOptions.mostPopular}
            </SelectItem>
            <SelectItem value="trending">
              {dict?.challengesPage.filters.popularityOptions.trending}
            </SelectItem>
            <SelectItem value="least-popular">
              {dict?.challengesPage.filters.popularityOptions.leastPopular}
            </SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger>
            <SelectValue
              placeholder={dict?.challengesPage.filters.recentness}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">
              {dict?.challengesPage.filters.recentnessOptions.newest}
            </SelectItem>
            <SelectItem value="oldest">
              {dict?.challengesPage.filters.recentnessOptions.oldest}
            </SelectItem>
            <SelectItem value="recently-updated">
              {dict?.challengesPage.filters.recentnessOptions.recentlyUpdated}
            </SelectItem>
          </SelectContent>
        </Select>
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
