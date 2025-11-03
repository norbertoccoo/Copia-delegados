import React, { useEffect, useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    fullScreen?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, fullScreen = false }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShow(true);
        } else {
            // Delay closing for animation
            const timer = setTimeout(() => setShow(false), 200);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!show) return null;

    return (
        <div 
            className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)'}} /* slate-900 with 75% opacity */
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div 
                className={`bg-white rounded-xl shadow-2xl relative flex flex-col transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${fullScreen ? 'w-[95vw] h-[95vh]' : 'w-full max-w-lg'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h3 id="modal-title" className="text-lg font-semibold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors" aria-label="Cerrar modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className={`p-6 ${fullScreen ? 'flex-grow overflow-y-auto' : ''}`}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;