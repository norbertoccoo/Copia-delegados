import React, { useMemo } from 'react';
import { Delegate } from '../types';
import { getHoursPerComite } from '../utils/calculations';

interface DashboardProps {
    delegates: Delegate[];
    filteredDelegates: Delegate[];
    isFiltered: boolean;
}

interface DashboardStats {
    totalDelegates: number;
    totalHours: number;
    ccooDelegates: number;
    ccooHours: number;
    ugtDelegates: number;
    ugtHours: number;
    sbDelegates: number;
    sbHours: number;
    otrosDelegates: number;
    otrosHours: number;
}

const calculateStats = (delegatesToProcess: Delegate[]): DashboardStats => {
    return delegatesToProcess.reduce((acc, delegate) => {
        const hoursPerDelegate = getHoursPerComite(delegate.comite);

        // Accumulate delegates per union
        acc.ccooDelegates += delegate.ccoo;
        acc.ugtDelegates += delegate.ugt;
        acc.sbDelegates += delegate.sb;
        acc.otrosDelegates += delegate.otros;

        // Calculate and accumulate hours per union
        const ccooH = delegate.ccoo * hoursPerDelegate;
        const ugtH = delegate.ugt * hoursPerDelegate;
        const sbH = delegate.sb * hoursPerDelegate;
        const otrosH = delegate.otros * hoursPerDelegate;
        
        acc.ccooHours += ccooH;
        acc.ugtHours += ugtH;
        acc.sbHours += sbH;
        acc.otrosHours += otrosH;

        // Accumulate grand totals
        acc.totalDelegates += delegate.ccoo + delegate.ugt + delegate.sb + delegate.otros;
        acc.totalHours += ccooH + ugtH + sbH + otrosH;
        
        return acc;
    }, { 
        totalDelegates: 0, 
        totalHours: 0,
        ccooDelegates: 0, 
        ccooHours: 0,
        ugtDelegates: 0, 
        ugtHours: 0,
        sbDelegates: 0, 
        sbHours: 0,
        otrosDelegates: 0, 
        otrosHours: 0
    });
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-start">
        <div className="bg-teal-100 text-teal-600 rounded-full p-3 mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ delegates, filteredDelegates, isFiltered }) => {
    const stats = useMemo(() => {
        const dataToCalculate = isFiltered ? filteredDelegates : delegates;
        return calculateStats(dataToCalculate);
    }, [delegates, filteredDelegates, isFiltered]);


    const unionIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

    return (
        <div className="relative">
            {isFiltered && (
                <div className="absolute top-[-2.5rem] left-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                        <svg className="-ml-1 mr-1.5 h-4 w-4 text-teal-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        Mostrando resultados filtrados
                    </span>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <StatCard 
                    title="Total Delegados" 
                    value={stats.totalDelegates}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard 
                    title="Total Horas" 
                    value={`${stats.totalHours}h`}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                />
                <StatCard 
                    title="CCOO" 
                    value={`${stats.ccooDelegates} - ${stats.ccooHours}h`}
                    icon={unionIcon}
                />
                <StatCard 
                    title="UGT" 
                    value={`${stats.ugtDelegates} - ${stats.ugtHours}h`}
                    icon={unionIcon}
                />
                <StatCard 
                    title="SB" 
                    value={`${stats.sbDelegates} - ${stats.sbHours}h`}
                    icon={unionIcon}
                />
                <StatCard 
                    title="OTROS" 
                    value={`${stats.otrosDelegates} - ${stats.otrosHours}h`}
                    icon={unionIcon}
                />
            </div>
        </div>
    );
};

export default Dashboard;