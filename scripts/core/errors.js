// errors.js - Stati UI e sanitizzazione

/**
 * Mostra un indicatore di caricamento in un container.
 *
 * @param {HTMLElement} container - Elemento DOM dove mostrare lo stato di caricamento
 * @param {string} [message="Caricamento..."] - Messaggio da visualizzare
 * @returns {void}
 *
 * @example
 * showLoading(container, 'Sto caricando...');
 */
export function showLoading(container, message = "Caricamento...") {
    if (!container) {
        return;
    }

    container.innerHTML = `<div class="loading">${sanitizeHTML(message)}</div>`;
}

/**
 * Mostra un messaggio di errore in un container.
 *
 * @param {HTMLElement} container - Elemento DOM dove mostrare l'errore
 * @param {string} [title="Errore"] - Titolo dell'errore
 * @param {string} [message=""] - Messaggio dettagliato
 * @returns {void}
 *
 * @example
 * showError(container, 'Errore', 'Dettagli...');
 */
export function showError(container, title = "Errore", message = "") {
    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="error">
            <strong>${sanitizeHTML(title)}</strong>
            ${message ? `<p>${sanitizeHTML(message)}</p>` : ""}
        </div>
    `;
}

/**
 * Mostra un messaggio "vuoto" in un container quando non ci sono dati.
 *
 * @param {HTMLElement} container - Elemento DOM dove mostrare il messaggio
 * @param {string} [message="Nessun dato disponibile."] - Messaggio da visualizzare
 * @returns {void}
 *
 * @example
 * showEmpty(container, 'Nessun elemento');
 */
export function showEmpty(container, message = "Nessun dato disponibile.") {
    if (!container) {
        return;
    }

    container.innerHTML = `<div class="empty">${sanitizeHTML(message)}</div>`;
}

/**
 * Pulisce il contenuto HTML di un container.
 *
 * @param {HTMLElement} container - Elemento DOM da svuotare
 * @returns {void}
 *
 * @example
 * clearContainer(container);
 */
export function clearContainer(container) {
    if (!container) {
        return;
    }

    container.innerHTML = "";
}

/**
 * Sostituisce i caratteri speciali con entità HTML per prevenire XSS.
 *
 * @param {any} value - Valore da sanificare
 * @returns {string} - Stringa sanificata
 *
 * @example
 * const s = sanitizeHTML('<script>alert(1)</script>');
 */
export function sanitizeHTML(value) {
    const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(value ?? "").replace(/[&<>"']/g, (match) => map[match]);
}

/**
 * Rimuove i tag HTML da una stringa e restituisce solo il testo.
 *
 * @param {string} html - HTML da cui estrarre il testo
 * @returns {string} - Testo senza tag HTML
 *
 * @example
 * const text = stripHtml('<p>ciao</p>');
 */
export function stripHtml(html) {
    if (!html) {
        return "";
    }

    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
}
