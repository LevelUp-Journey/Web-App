export function Penalization({ className = "" }: { className?: string }) {
  return (
    <section className={`w-full ${className}`} aria-labelledby="penalization-heading">
      <h3 id="penalization-heading" className="text-xl font-semibold mb-4">Penalization</h3>

      <ul className="list-disc pl-5 space-y-3 text-sm text-muted-foreground">
        <li>
          If the student reaches the maximum number of allowed attempts without success, the
          system may apply a penalty of 25 points to the student's current score.
        </li>
      </ul>
    </section>
  );
}

export default Penalization;
