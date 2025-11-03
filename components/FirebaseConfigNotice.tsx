import React from 'react';

const FirebaseConfigNotice: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 border border-slate-200 text-center">
                <svg className="mx-auto h-12 w-12 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="mt-4 text-2xl font-bold text-slate-800">Aviso de Almacenamiento Local</h1>
                <p className="mt-2 text-slate-600">
                    Toda la información se guarda de forma segura y privada en la base de datos local de tu navegador.
                </p>
                 <p className="mt-1 text-sm text-slate-500">
                    No se requiere ninguna configuración externa.
                </p>
            </div>
        </div>
    );
};

export default FirebaseConfigNotice;