import { QuickCalculator } from './components/calculator';
import { Panel } from './components/ui';

export function App() {
  return (
    <main className="notebook-grid min-h-screen text-ink-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-6 sm:px-gutter sm:py-10 lg:py-12">
        <Panel title="Calculator">
          <QuickCalculator />
        </Panel>
      </div>
    </main>
  );
}
