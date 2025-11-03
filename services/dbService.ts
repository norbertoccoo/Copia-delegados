import { Delegate } from '../types';
import { DB_NAME, DB_VERSION, STORE_NAME } from '../constants';

let db: IDBDatabase;

// Helper to wrap IDBRequest in a Promise
function promisifyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export const initDB = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
                const store = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
                // Create an index to enforce uniqueness on the combination of isla and nCentro
                store.createIndex('isla_nCentro_unique', ['isla', 'nCentro'], { unique: true });
            }
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(true);
        };

        request.onerror = (event) => {
            console.error("Error initializing IndexedDB:", (event.target as IDBOpenDBRequest).error);
            reject(new Error("No se pudo inicializar la base de datos local."));
        };
    });
};

export const getDelegates = async (): Promise<Delegate[]> => {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    return await promisifyRequest(store.getAll());
};

export const addDelegate = async (delegate: Omit<Delegate, 'id'>): Promise<void> => {
    if (!db) throw new Error("La base de datos no está inicializada.");
    
    const newId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newDelegate: Delegate = { ...delegate, id: newId };
    
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(newDelegate);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => {
             if (request.error?.name === 'ConstraintError') {
                reject(new Error(`Ya existe un registro para la Isla '${delegate.isla}' y N. Centro '${delegate.nCentro}'.`));
            } else {
                reject(request.error || new Error("Error al añadir el registro."));
            }
        };
    });
};

export const updateDelegate = async (id: string, field: keyof Delegate, value: any): Promise<void> => {
    if (!db) throw new Error("La base de datos no está inicializada.");

    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const getRequest = store.get(id);

    return new Promise((resolve, reject) => {
        getRequest.onerror = () => reject(getRequest.error || new Error("No se pudo encontrar el registro para actualizar."));
        
        getRequest.onsuccess = () => {
            const existingDelegate = getRequest.result;
            if (!existingDelegate) {
                reject(new Error("El registro a actualizar no existe."));
                return;
            }

            // Ensure numeric fields are stored as numbers
            const isNumericField = ['comite', 'ccoo', 'ugt', 'sb', 'otros'].includes(field);
            const valueToSave = isNumericField ? (parseInt(String(value), 10) || 0) : value;

            const updatedDelegate = { ...existingDelegate, [field]: valueToSave };
            const putRequest = store.put(updatedDelegate);
            
            putRequest.onsuccess = () => resolve();
            putRequest.onerror = () => {
                if (putRequest.error?.name === 'ConstraintError') {
                    reject(new Error(`La combinación de Isla y N. Centro ya existe para otro registro.`));
                } else {
                    reject(putRequest.error || new Error("Error al actualizar el registro."));
                }
            };
        };
    });
};

export const deleteDelegate = async (id: string): Promise<void> => {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    return await promisifyRequest(request as any); // Cast to any to satisfy TS
};

export const deleteAllDelegates = async (): Promise<void> => {
    if (!db) throw new Error("La base de datos no está inicializada.");
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();
    return await promisifyRequest(request as any); // Cast to any to satisfy TS
};