import { Delegate } from '../types';
import { getHoursPerComite, generateSubtotalReport } from '../utils/calculations';
import * as dbService from './dbService';
import { ISLAND_FULL_NAMES, CENTER_ALIASES } from '../constants';

declare global {
    interface Window {
        jspdf: any;
    }
}

export const exportToJson = (delegates: Delegate[]): void => {
    const delegatesWithHours = delegates.map(delegate => {
        const hoursPerDelegate = getHoursPerComite(delegate.comite);
        const ccooHours = delegate.ccoo * hoursPerDelegate;
        const ugtHours = delegate.ugt * hoursPerDelegate;
        const sbHours = delegate.sb * hoursPerDelegate;
        const otrosHours = delegate.otros * hoursPerDelegate;
        const totalHours = ccooHours + ugtHours + sbHours + otrosHours;
        
        return {
            isla: delegate.isla,
            nCentro: delegate.nCentro,
            comite: delegate.comite,
            ccoo: delegate.ccoo,
            horas_ccoo: ccooHours,
            ugt: delegate.ugt,
            horas_ugt: ugtHours,
            sb: delegate.sb,
            horas_sb: sbHours,
            otros: delegate.otros,
            horas_otros: otrosHours,
            horas_totales: totalHours
        };
    });

    const jsonContent = JSON.stringify(delegatesWithHours, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'delegados.json');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const importFromCsv = (file: File): Promise<{ importedCount: number, skippedCount: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const csvContent = e.target?.result as string;
                const lines = csvContent.split('\n').filter(line => line.trim() !== '');

                if (lines.length <= 1) {
                    return reject(new Error("El archivo CSV está vacío o solo contiene cabeceras."));
                }

                const headers = lines[0].split(';').map(h => h.trim());
                const requiredHeaders = ["Isla", "N. Centro", "Comité", "CCOO", "UGT", "SB", "OTROS"];
                const headerIndices: { [key: string]: number } = {};

                requiredHeaders.forEach(header => {
                    const index = headers.indexOf(header);
                    if (index === -1) throw new Error(`Falta la columna requerida: ${header}`);
                    headerIndices[header] = index;
                });

                let importedCount = 0;
                let skippedCount = 0;

                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(';');
                    const delegateData = {
                        isla: values[headerIndices["Isla"]].trim(),
                        nCentro: values[headerIndices["N. Centro"]].trim(),
                        comite: parseInt(values[headerIndices["Comité"]].trim(), 10) || 0,
                        ccoo: parseInt(values[headerIndices["CCOO"]].trim(), 10) || 0,
                        ugt: parseInt(values[headerIndices["UGT"]].trim(), 10) || 0,
                        sb: parseInt(values[headerIndices["SB"]].trim(), 10) || 0,
                        otros: parseInt(values[headerIndices["OTROS"]].trim(), 10) || 0,
                    };
                    
                    if (!delegateData.isla || !delegateData.nCentro) {
                        console.warn(`Skipping row with missing Isla or N. Centro: ${lines[i]}`);
                        skippedCount++;
                        continue;
                    }

                    try {
                        await dbService.addDelegate(delegateData);
                        importedCount++;
                    } catch (error) {
                       // This means it's a duplicate
                       skippedCount++;
                    }
                }
                resolve({ importedCount, skippedCount });

            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = () => reject(new Error("Error al leer el archivo."));
        reader.readAsText(file);
    });
};

export const importFromJson = (file: File): Promise<{ importedCount: number, skippedCount: number }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonContent = e.target?.result as string;
                const delegatesToImport = JSON.parse(jsonContent);

                if (!Array.isArray(delegatesToImport)) {
                    return reject(new Error("El archivo JSON debe contener un array de registros."));
                }
                
                if (delegatesToImport.length === 0) {
                     return reject(new Error("El archivo JSON está vacío."));
                }

                let importedCount = 0;
                let skippedCount = 0;
                
                for (const delegateData of delegatesToImport) {
                    // Basic validation
                    if (!delegateData.isla || !delegateData.nCentro) {
                        console.warn(`Skipping record with missing Isla or N. Centro: ${JSON.stringify(delegateData)}`);
                        skippedCount++;
                        continue;
                    }
                    
                    const delegateToAdd = {
                        isla: String(delegateData.isla),
                        nCentro: String(delegateData.nCentro),
                        comite: parseInt(String(delegateData.comite), 10) || 0,
                        ccoo: parseInt(String(delegateData.ccoo), 10) || 0,
                        ugt: parseInt(String(delegateData.ugt), 10) || 0,
                        sb: parseInt(String(delegateData.sb), 10) || 0,
                        otros: parseInt(String(delegateData.otros), 10) || 0,
                    };

                    try {
                        await dbService.addDelegate(delegateToAdd);
                        importedCount++;
                    } catch (error) {
                       // This means it's a duplicate
                       skippedCount++;
                    }
                }
                resolve({ importedCount, skippedCount });

            } catch (error) {
                if (error instanceof SyntaxError) {
                    reject(new Error("El archivo no es un JSON válido."));
                } else {
                    reject(error);
                }
            }
        };
        reader.onerror = () => reject(new Error("Error al leer el archivo."));
        reader.readAsText(file);
    });
};


export const exportToPdf = (delegates: Delegate[], isFiltered: boolean): void => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape'
    });

    const title = isFiltered 
        ? "Informe de Horas Sindicales (Resultados Filtrados)" 
        : "Informe Completo de Horas Sindicales";
    const date = new Date().toLocaleDateString('es-ES');
    
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generado el: ${date}`, 14, 26);

    const head = [[
        "Isla", "N. Centro", "Comité", "CCOO", "H. CCOO", "UGT", "H. UGT",
        "SB", "H. SB", "OTROS", "H. OTROS", "H. Totales"
    ]];
    
    const body = delegates.map(delegate => {
        const hoursPerDelegate = getHoursPerComite(delegate.comite);
        const ccooHours = delegate.ccoo * hoursPerDelegate;
        const ugtHours = delegate.ugt * hoursPerDelegate;
        const sbHours = delegate.sb * hoursPerDelegate;
        const otrosHours = delegate.otros * hoursPerDelegate;
        const totalHours = ccooHours + ugtHours + sbHours + otrosHours;
        const displayNCentro = CENTER_ALIASES[delegate.nCentro.toLowerCase()] || delegate.nCentro;

        return [
            delegate.isla,
            displayNCentro,
            delegate.comite,
            delegate.ccoo,
            `${ccooHours}h`,
            delegate.ugt,
            `${ugtHours}h`,
            delegate.sb,
            `${sbHours}h`,
            delegate.otros,
            `${otrosHours}h`,
            `${totalHours}h`
        ];
    });

    const totals = generateSubtotalReport(delegates);
    const footerData = [[
        { content: 'TOTALES', colSpan: 2, styles: { halign: 'left', fontStyle: 'bold' } },
        totals.totalComiteSum,
        totals.totalCcooDelegates,
        `${totals.totalCcooHours}h`,
        totals.totalUgtDelegates,
        `${totals.totalUgtHours}h`,
        totals.totalSbDelegates,
        `${totals.totalSbHours}h`,
        totals.totalOtrosDelegates,
        `${totals.totalOtrosHours}h`,
        `${totals.totalCalculatedHoursSum}h`
    ]];


    doc.autoTable({
        startY: 32,
        head: head,
        body: body,
        foot: footerData,
        theme: 'grid',
        headStyles: { 
            fillColor: [13, 148, 136], // teal-600
            textColor: 255, 
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
        },
        footStyles: {
            fillColor: [241, 245, 249], // slate-100
            textColor: [15, 23, 42], // slate-900
            fontStyle: 'bold',
            fontSize: 8,
            halign: 'center',
            valign: 'middle',
        },
        styles: { 
            fontSize: 8, 
            cellPadding: 2,
            valign: 'middle',
        },
        columnStyles: {
            0: { halign: 'center' }, // Isla
            1: { halign: 'left', cellWidth: 60 }, // N. Centro
            2: { halign: 'center' }, // Comité
            3: { halign: 'center' }, // CCOO (D)
            4: { halign: 'center' }, // CCOO (H)
            5: { halign: 'center' }, // UGT (D)
            6: { halign: 'center' }, // UGT (H)
            7: { halign: 'center' }, // SB (D)
            8: { halign: 'center' }, // SB (H)
            9: { halign: 'center' }, // OTROS (D)
            10: { halign: 'center' }, // OTROS (H)
            11: { halign: 'center', fontStyle: 'bold' }, // Total (H)
        },
        didDrawPage: (data: any) => {
            // Footer with page numbers
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(`Página ${doc.internal.getCurrentPageInfo().pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    doc.save('informe_horas_sindicales.pdf');
};