import { QuickCalculator } from './components/calculator';
import { Panel } from './components/ui';

export function App() {
  return (
    <main className="notebook-grid min-h-screen text-ink-950">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-gutter py-12">
        <Panel title="Quick mode">
          <QuickCalculator />
        </Panel>
      </div>
    </main>
  );
}
