import React, { useState } from 'react';
import Modal from './Modal';
import { Delegate } from '../types';
import { PREDEFINED_COMITE_VALUES } from '../constants';

interface AddDelegateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (delegate: Omit<Delegate, 'id'>) => void;
}

const initialFormState: Omit<Delegate, 'id'> = {
    isla: 'GC',
    nCentro: '',
    comite: 5,
    ccoo: 0,
    ugt: 0,
    sb: 0,
    otros: 0,
};

const AddDelegateModal: React.FC<AddDelegateModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const isNumericField = ['comite', 'ccoo', 'ugt', 'sb', 'otros'].includes(name);
        setFormData(prev => ({
            ...prev,
            [name]: isNumericField ? parseInt(value, 10) || 0 : value
        }));
    };
    
    const validate = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.isla.trim()) newErrors.isla = "La isla es requerida.";
        if (!formData.nCentro.trim()) newErrors.nCentro = "El nombre del centro es requerido.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            onAdd(formData);
            setFormData(initialFormState); // Reset form after submission
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Registro">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="isla" className="block text-slate-700 text-sm font-semibold mb-1">Isla</label>
                        <select id="isla" name="isla" value={formData.isla} onChange={handleChange} className="form-input">
                            <option value="GC">GC</option>
                            <option value="TF">TF</option>
                            <option value="PAL">PAL</option>
                            <option value="LZ">LZ</option>
                            <option value="FV">FV</option>
                        </select>
                         {errors.isla && <p className="text-red-500 text-xs mt-1">{errors.isla}</p>}
                    </div>
                    <div>
                        <label htmlFor="comite" className="block text-slate-700 text-sm font-semibold mb-1">Comité</label>
                        <select id="comite" name="comite" value={formData.comite} onChange={handleChange} className="form-input">
                            {PREDEFINED_COMITE_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                </div>
                 <div>
                    <label htmlFor="nCentro" className="block text-slate-700 text-sm font-semibold mb-1">N. Centro</label>
                    <input type="text" id="nCentro" name="nCentro" value={formData.nCentro} onChange={handleChange} className="form-input" placeholder="Nombre del centro" />
                    {errors.nCentro && <p className="text-red-500 text-xs mt-1">{errors.nCentro}</p>}
                </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                     <div>
                        <label htmlFor="ccoo" className="block text-slate-700 text-sm font-semibold mb-1">CCOO</label>
                        <input type="number" id="ccoo" name="ccoo" min="0" value={formData.ccoo} onChange={handleChange} className="form-input" />
                     </div>
                     <div>
                        <label htmlFor="ugt" className="block text-slate-700 text-sm font-semibold mb-1">UGT</label>
                        <input type="number" id="ugt" name="ugt" min="0" value={formData.ugt} onChange={handleChange} className="form-input" />
                     </div>
                     <div>
                        <label htmlFor="sb" className="block text-slate-700 text-sm font-semibold mb-1">SB</label>
                        <input type="number" id="sb" name="sb" min="0" value={formData.sb} onChange={handleChange} className="form-input" />
                     </div>
                     <div>
                        <label htmlFor="otros" className="block text-slate-700 text-sm font-semibold mb-1">Otros</label>
                        <input type="number" id="otros" name="otros" min="0" value={formData.otros} onChange={handleChange} className="form-input" />
                     </div>
                 </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 -mx-6 px-6 pb-0">
                    <button type="button" onClick={onClose} className="btn btn-outline">Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar Registro</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddDelegateModal;
