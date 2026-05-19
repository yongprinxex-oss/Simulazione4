// view-state.js - helper async page section

import { clearContainer, showLoading } from "./errors.js";

/**
 * Esegue una sezione asincrona con stato di loading e callback di successo/errore.
 *
 * @param {object} options - Parametri dell'operazione
 * @param {HTMLElement} options.loadingContainer - Container dove mostrare lo stato di caricamento
 * @param {string} [options.loadingMessage="Caricamento..."] - Messaggio di loading
 * @param {Function} options.request - Funzione che ritorna una Promise con i dati
 * @param {Function} options.onSuccess - Callback chiamata con i dati in caso di successo
 * @param {Function} [options.onError] - Callback in caso di errore
 * @param {Array<HTMLElement>} [options.clearContainers=[]] - Array di container da pulire prima del caricamento
 * @returns {Promise<any>|void} - Il valore restituito da `onSuccess` o `onError`, se presenti
 *
 * @example
 * await runAsyncSection({ loadingContainer, request: fetchData, onSuccess: render });
 */
export async function runAsyncSection({
    loadingContainer,
    loadingMessage = "Caricamento...",
    request,
    onSuccess,
    onError,
    clearContainers = [],
}) {
    if (!loadingContainer || typeof request !== "function" || typeof onSuccess !== "function") {
        return;
    }

    showLoading(loadingContainer, loadingMessage);

    clearContainers.forEach((container) => {
        clearContainer(container);
    });

    try {
        const data = await request();
        return onSuccess(data);
    } catch (error) {
        if (typeof onError === "function") {
            return onError(error);
        }

        throw error;
    }
}
