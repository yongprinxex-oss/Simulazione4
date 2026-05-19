// footer.js - footer riusabile

/**
 * Crea il nodo footer dell'app.
 *
 * @returns {HTMLElement} - Nodo DOM del footer
 *
 * @example
 * const f = createFooter();
 */
export function createFooter() {
    const footer = document.createElement("footer");
    footer.className = "footer";

    footer.innerHTML = `
        <div class="footer-content">
            <p>HN Tech Feed | Dati da <a href="https://hacker-news.firebaseio.com" target="_blank" rel="noreferrer">Hacker News API</a></p>
            <p>Top Stories, thread commenti, profili utente e read-it-later.</p>
        </div>
    `;

    return footer;
}

/**
 * Monta il footer nel DOM (di default in `document.body`).
 *
 * @param {HTMLElement} [container=document.body] - Container dove appendere il footer
 * @returns {void}
 *
 * @example
 * mountFooter();
 */
export function mountFooter(container = document.body) {
    container.appendChild(createFooter());
}
