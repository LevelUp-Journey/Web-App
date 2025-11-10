"use client"

import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export function AnimatedThemeTogglerDemo() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Animated Theme Toggler Demo</h2>
        <p className="text-muted-foreground mb-6">
          Click the buttons below to see the animated theme transition effect
        </p>
      </div>

      <div className="space-y-6">
        {/* Default Example */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Default</h3>
          <AnimatedThemeToggler className="h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md" />
        </div>

        {/* Custom Duration */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Slower Animation (800ms)</h3>
          <AnimatedThemeToggler 
            duration={800}
            className="h-12 w-12 hover:bg-accent hover:text-accent-foreground transition-colors rounded-md bg-primary text-primary-foreground" 
          />
        </div>

        {/* Fast Animation */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Faster Animation (200ms)</h3>
          <AnimatedThemeToggler 
            duration={200}
            className="h-8 w-8 hover:bg-accent hover:text-accent-foreground transition-colors rounded-full border" 
          />
        </div>

        {/* Custom Styled */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Custom Styled</h3>
          <AnimatedThemeToggler 
            className="h-14 w-14 bg-linear-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105" 
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-2">Features:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          <li>Smooth circular animation using View Transitions API</li>
          <li>Compatible with next-themes</li>
          <li>Customizable animation duration</li>
          <li>Fully accessible with screen reader support</li>
          <li>Hydration-safe (prevents mismatches)</li>
          <li>Fallback for browsers without View Transitions support</li>
        </ul>
      </div>
    </div>
  )
}