export function GeneralRules({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full ${className}`} aria-labelledby="general-rules-heading">
      <h3 id="general-rules-heading" className="text-xl font-semibold mb-4">General Rules</h3>

      <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
        <li>
          If the challenge is successfully solved (100% of test cases passed) → the student receives
          100% of the points defined by the instructor.
        </li>
        <li>
          If the student passes between 50% and 99% of the test cases → they receive 50% of the
          points defined.
        </li>
        <li>
          If the student passes less than 50% of the test cases → they receive no points, but the
          attempt is still recorded.
        </li>
      </ul>
    </section>
  );
}

export default GeneralRules;
