export interface SensorData {
    temperature: number;
    vibration: number;
    pressure: number;
    hours: number;
}

export interface AnalysisResult {
    maintenanceNeeded: boolean;
    urgency: 'low' | 'medium' | 'high';
    confidence: number;
    reasoning: string;
    recommendedAction: string;
    estimatedTimeToFailure: string;
    affectedComponents: string[];
}

export const analyzeSensorData = (data: SensorData): AnalysisResult => {
    const { temperature, vibration, pressure, hours } = data;

    // Normal Ranges
    // Temperature: 70-85 (operating: 65-90, critical: >95)
    // Vibration: 0.5-2.0 (warning: >2.5, critical: >3.5)
    // Pressure: 55-65 (warning: <50 or >70, critical: <45 or >75)
    // Hours: Maintenance every 2000

    const issues: string[] = [];
    let criticalCount = 0;
    let warningCount = 0;
    let confidenceScore = 80; // Base confidence

    // Temperature Analysis
    if (temperature > 95) {
        issues.push(`Temperature critical (${temperature}°C)`);
        criticalCount++;
        confidenceScore += 10;
    } else if (temperature > 90 || temperature < 65) {
        issues.push(`Temperature out of range (${temperature}°C)`);
        warningCount++;
        confidenceScore += 5;
    } else if (temperature > 85 || temperature < 70) {
        // Slight deviation
        confidenceScore += 2;
    }

    // Vibration Analysis
    if (vibration > 3.5) {
        issues.push(`Vibration critical (${vibration} mm/s)`);
        criticalCount++;
        confidenceScore += 10;
    } else if (vibration > 2.5) {
        issues.push(`Vibration warning (${vibration} mm/s)`);
        warningCount++;
        confidenceScore += 5;
    } else if (vibration > 2.0) {
        // Slight deviation
        confidenceScore += 2;
    }

    // Pressure Analysis
    if (pressure > 75 || pressure < 45) {
        issues.push(`Pressure critical (${pressure} PSI)`);
        criticalCount++;
        confidenceScore += 10;
    } else if (pressure > 70 || pressure < 50) {
        issues.push(`Pressure warning (${pressure} PSI)`);
        warningCount++;
        confidenceScore += 5;
    }

    // Hours Analysis
    const hoursRemaining = 2000 - (hours % 2000);
    const isMaintenanceDue = hoursRemaining <= 0;
    const isMaintenanceSoon = hoursRemaining < 500;

    if (isMaintenanceDue) {
        issues.push(`Scheduled maintenance overdue (Hours: ${hours})`);
        warningCount++; // Treat as warning unless other factors present
        confidenceScore += 10;
    } else if (isMaintenanceSoon) {
        issues.push(`Approaching scheduled maintenance (${hoursRemaining}h remaining)`);
        confidenceScore += 5;
    }

    // Decision Logic
    const maintenanceNeeded = criticalCount > 0 || warningCount >= 2 || isMaintenanceDue || (warningCount >= 1 && isMaintenanceSoon);

    let urgency: 'low' | 'medium' | 'high' = 'low';
    if (criticalCount > 0 || (warningCount > 0 && isMaintenanceSoon)) {
        urgency = 'high';
    } else if (warningCount >= 2 || isMaintenanceSoon) {
        urgency = 'medium';
    }

    // Cap confidence
    const confidence = Math.min(98, Math.max(70, confidenceScore));

    // Reasoning Generation
    let reasoning = "All systems operating within normal parameters.";
    if (issues.length > 0) {
        reasoning = `Detected anomalies: ${issues.join('. ')}.`;
    }

    // Recommendations
    let recommendedAction = "Continue monitoring.";
    let affectedComponents: string[] = [];
    let estimatedTimeToFailure = "N/A";

    if (maintenanceNeeded) {
        if (temperature > 85) affectedComponents.push("Cooling System");
        if (vibration > 2.0) affectedComponents.push("Bearing Assembly", "Motor Mounts");
        if (pressure < 55 || pressure > 65) affectedComponents.push("Hydraulic System", "Valves");
        if (isMaintenanceDue || isMaintenanceSoon) affectedComponents.push("General Service Kit");

        if (urgency === 'high') {
            recommendedAction = "IMMEDIATE ACTION REQUIRED: Stop machine and inspect affected components.";
            estimatedTimeToFailure = "12-24 hours";
        } else if (urgency === 'medium') {
            recommendedAction = "Schedule maintenance within 3 days. Monitor closely.";
            estimatedTimeToFailure = "3-5 days";
        } else {
            recommendedAction = "Plan maintenance for next scheduled downtime.";
            estimatedTimeToFailure = "1-2 weeks";
        }
    }

    return {
        maintenanceNeeded,
        urgency: maintenanceNeeded ? urgency : 'low',
        confidence,
        reasoning,
        recommendedAction,
        estimatedTimeToFailure,
        affectedComponents
    };
};
