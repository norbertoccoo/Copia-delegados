import React, { useState, useMemo } from 'react';
import Modal from './Modal';
import { Delegate } from '../types';
import { getHoursPerComite } from '../utils/calculations';
import { ISLAND_FULL_NAMES } from '../constants';

interface SummaryModalProps {
    isOpen: boolean;
    onClose: () => void;
    allDelegates: Delegate[];
}

interface SummaryData {
    delegates: number;
    hours: number;
}

interface UnionSummary {
    ccoo: SummaryData;
    ugt: SummaryData;
    sb: SummaryData;
    otros: SummaryData;
}

const SummaryReportBlock: React.FC<{summary: UnionSummary, title: string}> = ({ summary, title }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-4">
       <h5 className="text-md font-semibold mb-3 text-slate-800">{title}</h5>
       <ul className="text-sm space-y-2">
            {Object.entries(summary).map(([key, value]) => {
                 // Fix: Cast value to SummaryData as TypeScript infers its type as unknown here.
                 const data = value as SummaryData;
                 return (
                    <li key={key} className="flex justify-between items-center">
                        <span className="font-semibold uppercase text-slate-600">{key}:</span>
                        <span className="text-slate-800">{data.delegates} delegados / {data.hours} horas</span>
                    </li>
                 );
            })}
       </ul>
   </div>
);

const calculateUnionSummary = (delegates: Delegate[]): UnionSummary => {
    const emptyTotals: UnionSummary = {
        ccoo: { delegates: 0, hours: 0 },
        ugt: { delegates: 0, hours: 0 },
        sb: { delegates: 0, hours: 0 },
        otros: { delegates: 0, hours: 0 },
    };

    return delegates.reduce((acc, delegate) => {
        const hoursPerDelegate = getHoursPerComite(delegate.comite);
        acc.ccoo.delegates += delegate.ccoo || 0;
        acc.ccoo.hours += (delegate.ccoo || 0) * hoursPerDelegate;
        acc.ugt.delegates += delegate.ugt || 0;
        acc.ugt.hours += (delegate.ugt || 0) * hoursPerDelegate;
        acc.sb.delegates += delegate.sb || 0;
        acc.sb.hours += (delegate.sb || 0) * hoursPerDelegate;
        acc.otros.delegates += delegate.otros || 0;
        acc.otros.hours += (delegate.otros || 0) * hoursPerDelegate;
        return acc;
    }, emptyTotals);
};


const SummaryModal: React.FC<SummaryModalProps> = ({ isOpen, onClose, allDelegates }) => {
    const [selectedIsla, setSelectedIsla] = useState('TODAS');

    const summaryReport = useMemo(() => {
        if (!allDelegates || allDelegates.length === 0) {
            return { 
                grandTotals: calculateUnionSummary([]), 
                islandSummaries: {},
                isEmpty: true
            };
        }

        const grandTotals = calculateUnionSummary(allDelegates);

        const delegatesByIsla = allDelegates.reduce((acc, delegate) => {
            if (!acc[delegate.isla]) {
                acc[delegate.isla] = [];
            }
            acc[delegate.isla].push(delegate);
            return acc;
        }, {} as { [key: string]: Delegate[] });

        const islandSummaries: { [key: string]: UnionSummary } = {};
        for (const isla in delegatesByIsla) {
            islandSummaries[isla] = calculateUnionSummary(delegatesByIsla[isla]);
        }
        
        return { grandTotals, islandSummaries, isEmpty: false };

    }, [allDelegates]);
    

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Resumen de Horas Sindicales" fullScreen>
            <div className="flex flex-col h-full">
                <div className="mb-4">
                    <label htmlFor="filterIslaSummary" className="block text-slate-700 text-sm font-semibold mb-2">Filtrar por Isla</label>
                    <select id="filterIslaSummary" className="form-input" value={selectedIsla} onChange={e => setSelectedIsla(e.target.value)}>
                        <option value="TODAS">Todas las Islas</option>
                        <option value="GC">Gran Canaria</option>
                        <option value="TF">Tenerife</option>
                        <option value="PAL">La Palma</option>
                        <option value="LZ">Lanzarote</option>
                        <option value="FV">Fuerteventura</option>
                    </select>
                </div>
                <div className="flex-grow overflow-y-auto p-4 bg-slate-50 rounded-lg">
                   {summaryReport.isEmpty ? (
                        <div className="text-center py-16">
                           <h3 className="text-lg font-semibold text-slate-700">No hay datos disponibles</h3>
                           <p className="text-slate-500 mt-1">Añade registros para poder ver el resumen.</p>
                        </div>
                   ) : (
                       <>
                           {selectedIsla === 'TODAS' && (
                               <>
                                 <SummaryReportBlock summary={summaryReport.grandTotals} title="Resumen Total General"/>
                                 <h4 className="text-lg font-semibold my-4 text-slate-800">Desglose por Isla</h4>
                                 {Object.keys(summaryReport.islandSummaries).sort().map(isla => 
                                    <SummaryReportBlock 
                                        key={isla} 
                                        summary={summaryReport.islandSummaries[isla]} 
                                        title={`${ISLAND_FULL_NAMES[isla] || isla}`}
                                    />
                                 )}
                               </>
                           )}
                           {selectedIsla !== 'TODAS' && summaryReport.islandSummaries[selectedIsla] && (
                                <SummaryReportBlock 
                                    summary={summaryReport.islandSummaries[selectedIsla]} 
                                    title={`Resumen para ${ISLAND_FULL_NAMES[selectedIsla] || selectedIsla}`}
                                />
                           )}
                           {selectedIsla !== 'TODAS' && !summaryReport.islandSummaries[selectedIsla] && (
                               <div className="text-center py-16">
                                   <h3 className="text-lg font-semibold text-slate-700">Sin datos para esta isla</h3>
                                   <p className="text-slate-500 mt-1">No hay registros para la isla seleccionada.</p>
                               </div>
                           )}
                       </>
                   )}
                </div>
                 <div className="flex justify-end pt-4 mt-4 border-t border-slate-200">
                    <button onClick={onClose} className="btn btn-secondary">Cerrar</button>
                </div>
            </div>
        </Modal>
    );
};

export default SummaryModal;