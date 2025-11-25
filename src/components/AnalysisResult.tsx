import React from 'react';
import type { AnalysisResult as IAnalysisResult } from '../lib/agent';
import { AlertTriangle, CheckCircle, AlertOctagon, Wrench, Clock, Activity } from 'lucide-react';
import clsx from 'clsx';

interface Props {
    result: IAnalysisResult | null;
}

export const AnalysisResult: React.FC<Props> = ({ result }) => {
    if (!result) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-12 border-2 border-dashed border-slate-800 rounded-xl">
                <Activity className="w-12 h-12 mb-4 opacity-50" />
                <p>Awaiting sensor data analysis...</p>
            </div>
        );
    }

    const urgencyColors = {
        low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        high: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    };

    const UrgencyIcon = {
        low: CheckCircle,
        medium: AlertTriangle,
        high: AlertOctagon
    }[result.urgency];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Card */}
            <div className={clsx(
                'p-6 rounded-xl border flex items-start justify-between',
                urgencyColors[result.urgency]
            )}>
                <div>
                    <div className="flex items-center gap-2 font-semibold mb-1 uppercase tracking-wider text-sm">
                        <UrgencyIcon className="w-5 h-5" />
                        {result.urgency} Urgency
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">
                        {result.maintenanceNeeded ? 'Maintenance Required' : 'System Healthy'}
                    </h2>
                </div>
                <div className="text-right">
                    <div className="text-sm opacity-75 mb-1">Confidence</div>
                    <div className="text-3xl font-bold">{result.confidence}%</div>
                </div>
            </div>

            {/* Main Analysis Grid */}
            <div className="grid grid-cols-1 gap-6">
                {/* Reasoning */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider">Analysis</h3>
                    <p className="text-slate-200 leading-relaxed">{result.reasoning}</p>
                </div>

                {/* Action & Timing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Wrench className="w-4 h-4" />
                            Recommended Action
                        </h3>
                        <p className="text-slate-200 font-medium">{result.recommendedAction}</p>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-medium text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Est. Time to Failure
                        </h3>
                        <p className="text-slate-200 font-medium">{result.estimatedTimeToFailure}</p>
                    </div>
                </div>

                {/* Affected Components */}
                {result.affectedComponents.length > 0 && (
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                        <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Affected Components</h3>
                        <div className="flex flex-wrap gap-2">
                            {result.affectedComponents.map((component, idx) => (
                                <span key={idx} className="px-3 py-1 bg-slate-800 text-slate-200 rounded-full text-sm border border-slate-700">
                                    {component}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
