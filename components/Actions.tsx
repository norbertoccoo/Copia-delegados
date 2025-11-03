import React, { useRef } from 'react';

interface ActionsProps {
    onAdd: () => void;
    onExportJson: () => void;
    onImport: (file: File) => void;
    onExportPdf: () => void;
    onFilter: () => void;
    onSummary: () => void;
    onDeleteAll: () => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

const Actions: React.FC<ActionsProps> = ({ onAdd, onExportJson, onImport, onExportPdf, onFilter, onSummary, onDeleteAll, searchTerm, onSearchChange }) => {
    const importInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        importInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImport(file);
        }
        event.target.value = ''; // Reset input
    };

    return (
        <div className="bg-slate-50 border-t border-b border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Left side: Search */}
                <div className="relative w-full sm:max-w-xs">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por centro o isla..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="form-input pl-10"
                    />
                </div>
                
                {/* Right side: Buttons */}
                <div className="flex flex-wrap justify-center items-center gap-3">
                    <button onClick={onAdd} className="btn btn-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Añadir
                    </button>
                    
                    <button onClick={onFilter} className="btn btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                        Filtrar
                    </button>
                    
                    <button onClick={onSummary} className="btn btn-outline">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                        Resumen
                    </button>
                    
                    {/* Hidden input for CSV import */}
                    <input type="file" ref={importInputRef} accept=".csv,.json" className="hidden" onChange={handleFileChange} />
                    
                    {/* Dropdown for Import/Export could be a future improvement */}
                    <button onClick={handleImportClick} className="btn btn-outline">Importar</button>
                    <button onClick={onExportJson} className="btn btn-outline">Exportar JSON</button>
                    <button onClick={onExportPdf} className="btn btn-outline">Exportar PDF</button>
                    <button onClick={onDeleteAll} className="btn btn-outline text-red-600 hover:bg-red-100 hover:text-red-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Borrar Todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Actions;