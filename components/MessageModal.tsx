import React from 'react';
import Modal from './Modal';

interface MessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    isConfirm?: boolean;
    onConfirm?: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ isOpen, onClose, title, message, isConfirm, onConfirm }) => {
    
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-slate-600 text-base">{message}</p>
            <div className="flex justify-end mt-6 pt-4 space-x-3 border-t border-slate-200 -mx-6 px-6 pb-0">
                {isConfirm ? (
                    <>
                        <button onClick={onClose} className="btn btn-outline">Cancelar</button>
                        <button onClick={handleConfirm} className="btn btn-primary">Confirmar</button>
                    </>
                ) : (
                    <button onClick={onClose} className="btn btn-primary">Aceptar</button>
                )}
            </div>
        </Modal>
    );
};

export default MessageModal;