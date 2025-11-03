import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Delegate } from './types';
import * as dbService from './services/dbService';
import * as fileService from './services/fileService';
import Header from './components/Header';
import Actions from './components/Actions';
import DelegateTable from './components/DelegateTable';
import FilterModal from './components/FilterModal';
import SummaryModal from './components/SummaryModal';
import MessageModal from './components/MessageModal';
import Dashboard from './components/Dashboard';
import AddDelegateModal from './components/AddDelegateModal';
import ToastContainer, { Toast } from './components/ToastContainer';

const App: React.FC = () => {
    const [delegates, setDelegates] = useState<Delegate[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState({ isla: 'TODAS' });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof Delegate; direction: 'ascending' | 'descending' } | null>(null);
    
    const [isFilterModalOpen, setFilterModalOpen] = useState(false);
    const [isSummaryModalOpen, setSummaryModalOpen] = useState(false);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    
    const [toasts, setToasts] = useState<Toast[]>([]);

    const [messageModal, setMessageModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        isConfirm?: boolean;
        onConfirm?: () => void;
    }>({ isOpen: false, title: '', message: '' });
    
    const showToast = (type: 'success' | 'error', title: string, message: string) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, title, message }]);
    };

    const fetchDelegates = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await dbService.getDelegates();
            setDelegates(data);
        } catch (error) {
            console.error("Error fetching delegates:", error);
            const errorMessage = (error as Error).message || 'No se pudieron cargar los delegados.';
            showToast('error', 'Error de Carga', errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                await dbService.initDB();
                await fetchDelegates();
            } catch (error) {
                console.error("Error initializing app:", error);
                const errorMessage = (error as Error).message || 'No se pudo inicializar la aplicación.';
                showToast('error', 'Error de Inicialización', errorMessage);
                setIsLoading(false);
            }
        };
        initializeApp();
    }, [fetchDelegates]);
    

    const showConfirmModal = (title: string, message: string, onConfirm: () => void) => {
        setMessageModal({ isOpen: true, title, message, isConfirm: true, onConfirm });
    };

    const handleAddDelegate = async (newDelegateData: Omit<Delegate, 'id'>) => {
        try {
            await dbService.addDelegate(newDelegateData);
            showToast('success', 'Éxito', 'Nuevo registro añadido correctamente.');
            setAddModalOpen(false);
            await fetchDelegates();
        } catch (error) {
            console.error("Error adding delegate:", error);
            showToast('error', 'Error', (error as Error).message || 'No se pudo añadir el registro.');
        }
    };

    const handleUpdateDelegate = async (id: string, field: keyof Delegate, value: any) => {
        try {
            await dbService.updateDelegate(id, field, value);
            // Optimistic update
            setDelegates(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
            showToast('success', 'Actualizado', `El campo ${field} se actualizó correctamente.`);
        } catch (error) {
            console.error("Error updating delegate:", error);
            showToast('error', 'Error de Actualización', (error as Error).message || 'No se pudo actualizar el registro.');
            await fetchDelegates(); // Refetch to revert optimistic UI
        }
    };

    const handleDeleteDelegate = (id: string) => {
        showConfirmModal(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar este registro?",
            async () => {
                try {
                    await dbService.deleteDelegate(id);
                    showToast('success', 'Éxito', 'Registro eliminado correctamente.');
                    await fetchDelegates();
                } catch (error) {
                    console.error("Error deleting delegate:", error);
                    showToast('error', 'Error de Eliminación', 'No se pudo eliminar el registro.');
                }
            }
        );
    };

    const handleDeleteAllDelegates = () => {
        showConfirmModal(
            "Confirmar Eliminación Total",
            "¿Estás seguro de que quieres eliminar TODOS los registros? Esta acción es irreversible.",
            async () => {
                try {
                    await dbService.deleteAllDelegates();
                    showToast('success', 'Éxito', 'Todos los registros han sido eliminados.');
                    await fetchDelegates();
                } catch (error) {
                    console.error("Error deleting all delegates:", error);
                    showToast('error', 'Error de Eliminación', 'No se pudieron eliminar todos los registros.');
                }
            }
        );
    };

    const handleImport = async (file: File) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        try {
            let result;
            if (fileExtension === 'csv') {
                result = await fileService.importFromCsv(file);
                showToast('success', "Importar CSV", `Importación completada. Registros nuevos: ${result.importedCount}. Omitidos: ${result.skippedCount}.`);
            } else if (fileExtension === 'json') {
                result = await fileService.importFromJson(file);
                showToast('success', "Importar JSON", `Importación completada. Registros nuevos: ${result.importedCount}. Omitidos: ${result.skippedCount}.`);
            } else {
                throw new Error('Formato de archivo no soportado. Por favor, sube un archivo .csv o .json.');
            }
            await fetchDelegates();
        } catch (error) {
            console.error("Error importing file:", error);
            showToast('error', 'Error de Importación', (error as Error).message || 'No se pudo importar el archivo.');
        }
    };

    const handleExportJSON = () => {
        if (delegates.length === 0) {
            showToast("error", "Exportar JSON", "No hay datos para exportar.");
            return;
        }
        try {
            fileService.exportToJson(delegates);
            showToast("success", "Exportar JSON", "Datos exportados correctamente.");
        } catch (error) {
            console.error("Error exporting JSON:", error);
            showToast("error", "Error de Exportación", "Hubo un error al exportar los datos.");
        }
    };

    const handleExportPDF = () => {
        const delegatesToExport = isFiltered ? filteredDelegates : delegates;
        if (delegatesToExport.length === 0) {
            showToast("error", "Exportar PDF", "No hay datos para exportar.");
            return;
        }
        try {
            fileService.exportToPdf(delegatesToExport, isFiltered);
            showToast("success", "Exportar PDF", "Informe PDF generado correctamente.");
        } catch (error) {
            console.error("Error exporting PDF:", error);
            showToast("error", "Error de Exportación", "Hubo un error al generar el PDF.");
        }
    };

    const isFiltered = useMemo(() => filters.isla !== 'TODAS' || searchTerm !== '', [filters, searchTerm]);

    const filteredDelegates = useMemo(() => {
        let processDelegates = [...delegates];

        if (filters.isla !== 'TODAS') {
            processDelegates = processDelegates.filter(d => d.isla.toLowerCase() === filters.isla.toLowerCase());
        }

        if (searchTerm) {
             processDelegates = processDelegates.filter(d =>
                d.nCentro.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.isla.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortConfig !== null) {
            processDelegates.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        
        return processDelegates;
    }, [delegates, filters, searchTerm, sortConfig]);

    return (
        <div className="min-h-screen flex flex-col items-center w-full px-4 sm:px-6 lg:px-8 py-8">
            <ToastContainer toasts={toasts} setToasts={setToasts} />
            <div className="w-full">
                <Header />
                <Dashboard 
                    delegates={delegates} 
                    filteredDelegates={filteredDelegates} 
                    isFiltered={isFiltered} 
                />
                <main className="bg-white rounded-xl shadow-md overflow-hidden mt-8">
                     <Actions
                        onAdd={() => setAddModalOpen(true)}
                        onExportJson={handleExportJSON}
                        onImport={handleImport}
                        onExportPdf={handleExportPDF}
                        onFilter={() => setFilterModalOpen(true)}
                        onSummary={() => setSummaryModalOpen(true)}
                        onDeleteAll={handleDeleteAllDelegates}
                        searchTerm={searchTerm}
                        onSearchChange={setSearchTerm}
                    />
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-20 text-center">
                            <div className="loading-spinner"></div>
                            <p className="mt-4 text-slate-500 font-medium">Cargando delegados...</p>
                        </div>
                    ) : (
                        <DelegateTable
                            delegates={filteredDelegates}
                            isFiltered={isFiltered}
                            onUpdate={handleUpdateDelegate}
                            onDelete={handleDeleteDelegate}
                            sortConfig={sortConfig}
                            onSort={setSortConfig}
                        />
                    )}
                </main>
            </div>

            <FilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onFilterChange={setFilters}
            />
            
            <AddDelegateModal 
                isOpen={isAddModalOpen}
                onClose={() => setAddModalOpen(false)}
                onAdd={handleAddDelegate}
            />

            <SummaryModal
                isOpen={isSummaryModalOpen}
                onClose={() => setSummaryModalOpen(false)}
                allDelegates={delegates}
            />

            <MessageModal
                isOpen={messageModal.isOpen}
                title={messageModal.title}
                message={messageModal.message}
                isConfirm={messageModal.isConfirm}
                onConfirm={messageModal.onConfirm}
                onClose={() => setMessageModal({ ...messageModal, isOpen: false })}
            />
        </div>
    );
};

export default App;