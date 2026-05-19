// page-loader.js - helper di caricamento collezioni

import { runAsyncSection } from "./view-state.js";
import { showEmpty, showError } from "./errors.js";

/**
 * Carica una collezione di elementi mostrando gli stati (loading/empty/error) e poi la rende.
 *
 * @param {object} options - Opzioni di caricamento
 * @param {HTMLElement} options.container - Container dove mostrare gli stati e il risultato
 * @param {Function} options.request - Funzione che restituisce una Promise con gli elementi
 * @param {string} options.loadingMessage - Messaggio di caricamento
 * @param {string} options.emptyMessage - Messaggio da mostrare se la lista è vuota
 * @param {Function} options.render - Funzione che renderizza gli elementi ricevuti
 * @returns {Promise<any>} - Il valore restituito da `runAsyncSection`
 *
 * @example
 * await loadCollection({ container, request: fetchList, loadingMessage: 'Carico...', emptyMessage: 'Vuoto', render: renderList });
 */
export async function loadCollection({
    container,
    request,
    loadingMessage,
    emptyMessage,
    render,
}) {
    return runAsyncSection({
        loadingContainer: container,
        loadingMessage,
        request,
        onSuccess: (items) => {
            if (!Array.isArray(items) || items.length === 0) {
                showEmpty(container, emptyMessage);
                return;
            }

            render(items);
        },
        onError: (error) => {
            showError(container, "Errore nel caricamento", error.message || "Operazione non riuscita");
        },
    });
}
