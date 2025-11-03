import React from 'react';

const FirebaseConfigNotice: React.FC = () => {
    const configSnippet = `
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_ID_DE_PROYECTO.firebaseapp.com",
    projectId: "TU_ID_DE_PROYECTO",
    storageBucket: "TU_ID_DE_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};`;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h1 className="mt-4 text-2xl font-bold text-slate-800">Configuración Requerida</h1>
                    <p className="mt-2 text-slate-600">
                        Para que la aplicación funcione, necesitas conectarla a tu propia base de datos de Firebase.
                    </p>
                </div>
                
                <div className="mt-6 text-left">
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Pasos a seguir:</h2>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                        <li>Ve a la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-teal-600 font-medium hover:underline">Consola de Firebase</a> y crea un nuevo proyecto.</li>
                        <li>Dentro de tu proyecto, ve a <strong>Compilación &gt; Firestore Database</strong> y crea una nueva base de datos (puedes empezar en modo de prueba).</li>
                        <li>Vuelve a la página principal del proyecto, haz clic en el icono web (<strong>&lt;/&gt;</strong>) para registrar tu aplicación.</li>
                        <li>Copia el objeto <code>firebaseConfig</code> que te proporcionará Firebase.</li>
                        <li>Abre el fichero <code className="bg-slate-100 text-red-600 px-1 py-0.5 rounded font-mono text-sm">services/dbService.ts</code> en el editor.</li>
                        <li>Pega tu objeto de configuración reemplazando el contenido de ejemplo:</li>
                    </ol>
                </div>

                <div className="mt-4 bg-slate-800 text-white p-4 rounded-lg font-mono text-xs overflow-x-auto">
                    <pre><code>{configSnippet.trim()}</code></pre>
                </div>
                
                <p className="mt-6 text-center text-sm text-slate-500">
                    Una vez guardado el fichero, la aplicación se recargará y funcionará correctamente.
                </p>
            </div>
        </div>
    );
};

export default FirebaseConfigNotice;
