import { useState } from 'react';
import { SensorInputForm } from './components/SensorInputForm';
import { AnalysisResult } from './components/AnalysisResult';
import { analyzeSensorData } from './lib/agent';
import type { SensorData, AnalysisResult as IAnalysisResult } from './lib/agent';
import { BrainCircuit } from 'lucide-react';

function App() {
  const [result, setResult] = useState<IAnalysisResult | null>(null);

  const handleAnalyze = (data: SensorData) => {
    // Simulate AI processing delay for realism
    setResult(null);
    setTimeout(() => {
      const analysis = analyzeSensorData(data);
      setResult(analysis);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <BrainCircuit className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AutoParts Inc.</h1>
            <p className="text-slate-400">Predictive Maintenance AI Agent</p>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <SensorInputForm onAnalyze={handleAnalyze} />
          </div>

          <div className="lg:col-span-7">
            <AnalysisResult result={result} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
