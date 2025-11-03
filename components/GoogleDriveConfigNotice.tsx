import React from 'react';

const GoogleDriveConfigNotice: React.FC = () => {
    return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4" role="alert">
            <div className="flex">
                <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.006-1.742 3.006H4.42c-1.522 0-2.492-1.672-1.742-3.006l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-3">
                    <p className="text-sm text-amber-700">
                        La función de exportar a Google Drive está desactivada.
                        <span className="font-medium text-amber-800"> El administrador de la aplicación debe configurar las credenciales de la API de Google (API Key y Client ID) en el entorno.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GoogleDriveConfigNotice;
