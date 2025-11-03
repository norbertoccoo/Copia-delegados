import React, { useEffect } from 'react';

export interface Toast {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'error';
}

interface ToastContainerProps {
    toasts: Toast[];
    setToasts: React.Dispatch<React.SetStateAction<Toast[]>>;
}

const ToastMessage: React.FC<{ toast: Toast, onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onDismiss(toast.id);
        }, 5000); // Auto-dismiss after 5 seconds

        return () => {
            clearTimeout(timer);
        };
    }, [toast.id, onDismiss]);
    
    const isSuccess = toast.type === 'success';
    const bgColor = isSuccess ? 'bg-teal-50' : 'bg-red-50';
    const iconColor = isSuccess ? 'text-teal-500' : 'text-red-500';
    const titleColor = isSuccess ? 'text-teal-800' : 'text-red-800';
    
    const Icon = () => isSuccess ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) : (
         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className={`w-full max-w-sm rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${bgColor}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className={`flex-shrink-0 ${iconColor}`}>
                       <Icon />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className={`text-sm font-semibold ${titleColor}`}>{toast.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{toast.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={() => onDismiss(toast.id)} className="inline-flex text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span className="sr-only">Close</span>
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, setToasts }) => {
    const handleDismiss = (id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    };

    return (
        <div className="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end z-[100]">
            <div className="max-w-sm w-full space-y-4">
                {toasts.map(toast => (
                    <ToastMessage key={toast.id} toast={toast} onDismiss={handleDismiss} />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;
