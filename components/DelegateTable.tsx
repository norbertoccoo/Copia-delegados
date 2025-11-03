import React from 'react';
import { Delegate } from '../types';
import { getHoursPerComite, generateSubtotalReport } from '../utils/calculations';
import EditableCell from './EditableCell';

interface DelegateTableProps {
    delegates: Delegate[];
    isFiltered: boolean;
    onUpdate: (id: string, field: keyof Delegate, value: any) => void;
    onDelete: (id: string) => void;
    sortConfig: { key: keyof Delegate; direction: 'ascending' | 'descending' } | null;
    onSort: (config: { key: keyof Delegate; direction: 'ascending' | 'descending' } | null) => void;
}

const SortIcon: React.FC<{ direction?: 'ascending' | 'descending' }> = ({ direction }) => {
    if (!direction) {
        return <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>;
    }
    if (direction === 'ascending') {
        return <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" /></svg>;
    }
    return <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
};


const TableHeader: React.FC<{ children: React.ReactNode; className?: string; sortKey?: keyof Delegate; sortConfig: DelegateTableProps['sortConfig']; onSort: DelegateTableProps['onSort'] }> = ({ children, className, sortKey, sortConfig, onSort }) => {
    const direction = (sortConfig && sortConfig.key === sortKey) ? sortConfig.direction : undefined;

    const handleSort = () => {
        if (!sortKey) return;

        let newDirection: 'ascending' | 'descending' = 'ascending';
        let shouldClearSort = false;

        // Check if the current column is being sorted
        if (sortConfig && sortConfig.key === sortKey) {
            if (sortConfig.direction === 'ascending') {
                // If ascending, switch to descending
                newDirection = 'descending';
            } else if (sortConfig.direction === 'descending') {
                // If descending, clear the sort
                shouldClearSort = true;
            }
        }
        
        if (shouldClearSort) {
            onSort(null);
        } else {
            onSort({ key: sortKey, direction: newDirection });
        }
    };

    return (
        <th className={`sticky top-0 bg-slate-100 p-3 text-sm text-left tracking-wider ${className}`}>
            <button onClick={handleSort} className="group flex items-center w-full justify-start text-slate-600 font-semibold disabled:cursor-not-allowed" disabled={!sortKey}>
                <span>{children}</span>
                {sortKey && <span className="ml-2"><SortIcon direction={direction} /></span>}
            </button>
        </th>
    );
};


const TableCell: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <td className={`p-3 border-b border-slate-200 text-sm text-slate-700 ${className}`}>{children}</td>
);

const DelegateTable: React.FC<DelegateTableProps> = ({ delegates, isFiltered, onUpdate, onDelete, sortConfig, onSort }) => {
    
    const subtotal = isFiltered ? generateSubtotalReport(delegates) : null;
    
    return (
        <div className="overflow-x-auto max-h-[70vh]">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <TableHeader sortKey="isla" sortConfig={sortConfig} onSort={onSort}>Isla</TableHeader>
                        <TableHeader sortKey="nCentro" sortConfig={sortConfig} onSort={onSort}>N. Centro</TableHeader>
                        <TableHeader sortKey="comite" sortConfig={sortConfig} onSort={onSort} className="text-center">Comité</TableHeader>
                        <TableHeader sortKey="ccoo" sortConfig={sortConfig} onSort={onSort} className="text-center">CCOO</TableHeader>
                        <TableHeader className="text-center" sortConfig={sortConfig} onSort={onSort}>Horas CCOO</TableHeader>
                        <TableHeader sortKey="ugt" sortConfig={sortConfig} onSort={onSort} className="text-center">UGT</TableHeader>
                        <TableHeader className="text-center" sortConfig={sortConfig} onSort={onSort}>Horas UGT</TableHeader>
                        <TableHeader sortKey="sb" sortConfig={sortConfig} onSort={onSort} className="text-center">SB</TableHeader>
                        <TableHeader className="text-center" sortConfig={sortConfig} onSort={onSort}>Horas SB</TableHeader>
                        <TableHeader sortKey="otros" sortConfig={sortConfig} onSort={onSort} className="text-center">OTROS</TableHeader>
                        <TableHeader className="text-center" sortConfig={sortConfig} onSort={onSort}>Horas OTROS</TableHeader>
                        <TableHeader className="text-center" sortConfig={sortConfig} onSort={onSort}>Horas Totales</TableHeader>
                        <TableHeader className="text-center" sortConfig={sortConfig} onSort={onSort}>Acciones</TableHeader>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                    {delegates.length > 0 ? (
                        delegates.map((delegate) => {
                            const hoursPerDelegate = getHoursPerComite(delegate.comite);
                            const ccooHours = delegate.ccoo * hoursPerDelegate;
                            const ugtHours = delegate.ugt * hoursPerDelegate;
                            const sbHours = delegate.sb * hoursPerDelegate;
                            const otrosHours = delegate.otros * hoursPerDelegate;
                            const totalHours = ccooHours + ugtHours + sbHours + otrosHours;
                            
                            return (
                                <tr key={delegate.id} className="odd:bg-white even:bg-slate-50 hover:bg-teal-50 transition-colors duration-150">
                                    <EditableCell id={delegate.id} field="isla" value={delegate.isla} onUpdate={onUpdate} />
                                    <EditableCell id={delegate.id} field="nCentro" value={delegate.nCentro} onUpdate={onUpdate} />
                                    <EditableCell id={delegate.id} field="comite" value={delegate.comite} onUpdate={onUpdate} type="comite" align="center" />
                                    <EditableCell id={delegate.id} field="ccoo" value={delegate.ccoo} onUpdate={onUpdate} type="number" align="center" />
                                    <TableCell className="text-center font-medium text-teal-700">{ccooHours}h</TableCell>
                                    <EditableCell id={delegate.id} field="ugt" value={delegate.ugt} onUpdate={onUpdate} type="number" align="center" />
                                    <TableCell className="text-center font-medium text-teal-700">{ugtHours}h</TableCell>
                                    <EditableCell id={delegate.id} field="sb" value={delegate.sb} onUpdate={onUpdate} type="number" align="center" />
                                    <TableCell className="text-center font-medium text-teal-700">{sbHours}h</TableCell>
                                    <EditableCell id={delegate.id} field="otros" value={delegate.otros} onUpdate={onUpdate} type="number" align="center" />
                                    <TableCell className="text-center font-medium text-teal-700">{otrosHours}h</TableCell>
                                    <TableCell className="text-center font-bold text-slate-800">{totalHours}h</TableCell>
                                    <TableCell className="text-center">
                                        <button 
                                            onClick={() => onDelete(delegate.id)}
                                            className="p-2 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-100 transition-colors duration-150"
                                            aria-label="Eliminar registro"
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </TableCell>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={13} className="text-center text-slate-500 py-16">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <h3 className="mt-2 text-lg font-semibold">No se encontraron resultados</h3>
                                <p className="mt-1 text-sm">Intenta ajustar la búsqueda o los filtros.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
                {isFiltered && subtotal && (
                     <tfoot className="bg-slate-100 font-bold text-slate-800">
                        <tr>
                            <TableCell className="text-left">TOTAL FILTRADO</TableCell>
                            <TableCell>{''}</TableCell>
                            <TableCell className="text-center">{subtotal.totalComiteSum}</TableCell>
                            <TableCell className="text-center">{subtotal.totalCcooDelegates}</TableCell>
                            <TableCell className="text-center">{subtotal.totalCcooHours}h</TableCell>
                            <TableCell className="text-center">{subtotal.totalUgtDelegates}</TableCell>
                            <TableCell className="text-center">{subtotal.totalUgtHours}h</TableCell>
                            <TableCell className="text-center">{subtotal.totalSbDelegates}</TableCell>
                            <TableCell className="text-center">{subtotal.totalSbHours}h</TableCell>
                            <TableCell className="text-center">{subtotal.totalOtrosDelegates}</TableCell>
                            <TableCell className="text-center">{subtotal.totalOtrosHours}h</TableCell>
                            <TableCell className="text-center">{subtotal.totalCalculatedHoursSum}h</TableCell>
                            <TableCell>{''}</TableCell>
                        </tr>
                    </tfoot>
                )}
            </table>
        </div>
    );
};

export default DelegateTable;