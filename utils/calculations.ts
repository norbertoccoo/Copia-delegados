
import { Delegate } from '../types';

export const getHoursPerComite = (comiteSize: number): number => {
    if (comiteSize >= 23) return 40;
    if (comiteSize === 17) return 35;
    if (comiteSize === 13) return 30;
    if (comiteSize === 9) return 20;
    if (comiteSize === 5) return 15;
    return 0;
};

export interface SubtotalReport {
    totalComiteSum: number;
    totalCcooDelegates: number;
    totalUgtDelegates: number;
    totalSbDelegates: number;
    totalOtrosDelegates: number;
    totalCcooHours: number;
    totalUgtHours: number;
    totalSbHours: number;
    totalOtrosHours: number;
    totalCalculatedHoursSum: number;
}

export const generateSubtotalReport = (delegates: Delegate[]): SubtotalReport => {
    const report: SubtotalReport = {
        totalComiteSum: 0,
        totalCcooDelegates: 0,
        totalUgtDelegates: 0,
        totalSbDelegates: 0,
        totalOtrosDelegates: 0,
        totalCcooHours: 0,
        totalUgtHours: 0,
        totalSbHours: 0,
        totalOtrosHours: 0,
        totalCalculatedHoursSum: 0,
    };

    delegates.forEach(delegate => {
        const hoursPerDelegate = getHoursPerComite(delegate.comite);
        const ccooHours = delegate.ccoo * hoursPerDelegate;
        const ugtHours = delegate.ugt * hoursPerDelegate;
        const sbHours = delegate.sb * hoursPerDelegate;
        const otrosHours = delegate.otros * hoursPerDelegate;

        report.totalComiteSum += delegate.comite;
        report.totalCcooDelegates += delegate.ccoo;
        report.totalUgtDelegates += delegate.ugt;
        report.totalSbDelegates += delegate.sb;
        report.totalOtrosDelegates += delegate.otros;
        report.totalCcooHours += ccooHours;
        report.totalUgtHours += ugtHours;
        report.totalSbHours += sbHours;
        report.totalOtrosHours += otrosHours;
        report.totalCalculatedHoursSum += ccooHours + ugtHours + sbHours + otrosHours;
    });
    
    return report;
};
