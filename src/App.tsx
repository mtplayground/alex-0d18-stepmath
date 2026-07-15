import { Button, Card, NumeralDisplay, Panel } from './components/ui';

const foundationAreas = [
  { label: 'Palette', tone: 'cobalt' },
  { label: 'Typography', tone: 'aqua' },
  { label: 'Shape', tone: 'lemon' },
  { label: 'Spacing', tone: 'success' },
] as const;

export function App() {
  return (
    <main className="notebook-grid min-h-screen text-ink-950">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-8 px-gutter py-12">
        <Panel
          actions={
            <>
              <Button variant="secondary">Secondary</Button>
              <Button>Primary</Button>
            </>
          }
          subtitle="Bright notebook surfaces, confident contrast, compact rounded shapes, and tabular numerals are ready for the calculator screens planned in later issues."
          title="Design system foundation"
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-eyebrow uppercase text-cobalt-600">Large numeral style</p>
              <NumeralDisplay>128</NumeralDisplay>
            </div>
            <Button className="sm:self-center" size="lg" variant="quiet">
              Quiet action
            </Button>
          </div>
        </Panel>

        <div className="grid gap-4 sm:grid-cols-2">
          {foundationAreas.map(({ label, tone }) => (
            <Card key={label} tone={tone}>
              <p className="text-base font-semibold text-ink-800">{label}</p>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
