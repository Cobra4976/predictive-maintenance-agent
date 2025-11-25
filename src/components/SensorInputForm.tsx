import React, { useState } from 'react';
import type { SensorData } from '../lib/agent';
import { Activity, Gauge, Clock, Thermometer } from 'lucide-react';

interface Props {
    onAnalyze: (data: SensorData) => void;
}

export const SensorInputForm: React.FC<Props> = ({ onAnalyze }) => {
    const [formData, setFormData] = useState<SensorData>({
        temperature: 75,
        vibration: 1.0,
        pressure: 60,
        hours: 1800
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAnalyze(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 text-slate-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Sensor Readings
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Thermometer className="w-4 h-4" />
                        Temperature (°C)
                    </label>
                    <input
                        type="number"
                        name="temperature"
                        value={formData.temperature}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                    />
                    <div className="text-xs text-slate-500">Normal: 70-85°C</div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Vibration (mm/s)
                    </label>
                    <input
                        type="number"
                        name="vibration"
                        value={formData.vibration}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                    />
                    <div className="text-xs text-slate-500">Normal: 0.5-2.0 mm/s</div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Gauge className="w-4 h-4" />
                        Pressure (PSI)
                    </label>
                    <input
                        type="number"
                        name="pressure"
                        value={formData.pressure}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                        step="0.1"
                    />
                    <div className="text-xs text-slate-500">Normal: 55-65 PSI</div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Operating Hours
                    </label>
                    <input
                        type="number"
                        name="hours"
                        value={formData.hours}
                        onChange={handleChange}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                    />
                    <div className="text-xs text-slate-500">Maintenance every 2000h</div>
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
                <Activity className="w-5 h-5" />
                Analyze System Status
            </button>
        </form>
    );
};
