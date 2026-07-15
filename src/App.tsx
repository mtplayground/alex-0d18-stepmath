const foundationAreas = [
  'React + TypeScript',
  'Tailwind CSS',
  'Expression engine folders',
  'Visualization folders',
];

export function App() {
  return (
    <main className="min-h-screen bg-sky-100 text-ink-950">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-6 py-12">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-sky-500">Issue #1</p>
          <h1 className="mt-3 text-4xl font-bold tracking-normal sm:text-5xl">
            React, TypeScript, and Tailwind foundation
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-600">
            The application shell is ready for the calculator, expression engine, and guided
            visualizations planned in later issues.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {foundationAreas.map((area) => (
            <div key={area} className="rounded-lg border border-white/70 bg-white p-5 shadow-sm">
              <p className="text-base font-semibold text-ink-800">{area}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
