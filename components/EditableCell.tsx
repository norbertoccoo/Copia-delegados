import React, { useState, useEffect } from 'react';
import { Delegate } from '../types';
import { PREDEFINED_COMITE_VALUES } from '../constants';

interface EditableCellProps {
    id: string;
    field: keyof Delegate;
    value: string | number;
    onUpdate: (id: string, field: keyof Delegate, value: any) => void;
    type?: 'text' | 'number' | 'comite';
    align?: 'left' | 'center' | 'right';
}

const EditableCell: React.FC<EditableCellProps> = ({ id, field, value, onUpdate, type = 'text', align = 'left' }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(value);
    const [comiteOtroValue, setComiteOtroValue] = useState('');

    useEffect(() => {
        setCurrentValue(value);
        if (type === 'comite' && !PREDEFINED_COMITE_VALUES.includes(String(value))) {
            setComiteOtroValue(String(value));
            setCurrentValue('Otros');
        }
    }, [value, type]);

    const handleSave = () => {
        let finalValue: string | number = currentValue;
        if (type === 'comite' && currentValue === 'Otros') {
            finalValue = comiteOtroValue.trim() || '0';
        }

        let valueToSave: string | number;

        if (type === 'number' || type === 'comite') {
            const parsed = parseInt(String(finalValue), 10);
            valueToSave = isNaN(parsed) ? 0 : parsed; // Default to 0 if parsing fails
        } else {
            valueToSave = String(finalValue);
        }

        if (valueToSave !== value) {
            onUpdate(id, field, valueToSave);
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        else if (e.key === 'Escape') {
            setCurrentValue(value);
            setIsEditing(false);
        }
    };
    
    const tdClassName = `p-0 text-sm text-slate-700`;
    const commonInputClasses = `form-input w-full h-full text-${align} p-3 rounded-none border-x-0 border-y-0 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50`;
    
    if (isEditing) {
        if (type === 'comite') {
            return (
                <td className={tdClassName}>
                    <select
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className={commonInputClasses}
                    >
                        {PREDEFINED_COMITE_VALUES.map(v => <option key={v} value={v}>{v}</option>)}
                        <option value="Otros">Otros</option>
                    </select>
                    {currentValue === 'Otros' && (
                        <input
                            type="number"
                            value={comiteOtroValue}
                            onChange={(e) => setComiteOtroValue(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={handleKeyDown}
                            className={`${commonInputClasses} mt-1`}
                            placeholder="Especifique"
                        />
                    )}
                </td>
            );
        }

        return (
            <td className={tdClassName}>
                <input
                    type={type === 'number' ? 'number' : 'text'}
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    onBlur={handleSave}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className={commonInputClasses}
                />
            </td>
        );
    }

    return (
        <td className={`p-3 border-b border-slate-200 text-sm text-slate-700 text-${align}`} onClick={() => setIsEditing(true)}>
            <span className="cursor-pointer block w-full h-full p-1 -m-1 rounded-md hover:bg-teal-100 hover:text-teal-800 transition duration-150 ease-in-out">
                {value}
            </span>
        </td>
    );
};

export default EditableCell;