import React from 'react';
import Modal from './Modal';

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: { isla: string };
    onFilterChange: (filters: { isla: string }) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, onFilterChange }) => {
    
    const handleApply = () => {
        onClose();
    };
    
    const handleReset = () => {
        onFilterChange({ isla: 'TODAS' });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Filtrar por Isla">
            <div className="space-y-6">
                <div>
                    <label htmlFor="filterIsla" className="block text-slate-700 text-sm font-semibold mb-2">Isla</label>
                    <select 
                        id="filterIsla" 
                        className="form-input"
                        value={filters.isla}
                        onChange={(e) => onFilterChange({ ...filters, isla: e.target.value })}
                    >
                        <option value="TODAS">TODAS</option>
                        <option value="GC">GC</option>
                        <option value="TF">TF</option>
                        <option value="PAL">PAL</option>
                        <option value="LZ">LZ</option>
                        <option value="FV">FV</option>
                    </select>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 -mx-6 px-6 pb-0">
                    <button onClick={handleReset} className="btn btn-outline">Restablecer</button>
                    <button onClick={handleApply} className="btn btn-primary">Aplicar Filtro</button>
                </div>
            </div>
        </Modal>
    );
};

export default FilterModal;