// thread-comments.js - rendering ricorsivo commenti con lazy loading rami

import { sanitizeHTML, stripHtml } from "../core/errors.js";
import { getCommentChildren } from "../services/api.js";

/**
 * Crea il nodo DOM per un singolo commento, con gestione lazy delle risposte.
 *
 * @param {object} comment - Oggetto commento mappato
 * @param {number} [depth=0] - Profondità del commento (usata per la classe di stile)
 * @returns {HTMLElement} - Nodo DOM dell'articolo commento
 *
 * @example
 * const node = createCommentNode(commentObj, 1);
 */
function createCommentNode(comment, depth = 0) {
    const wrapper = document.createElement("article");
    wrapper.className = `comment-card comment-card--depth-${Math.min(depth, 4)}`;

    const author = sanitizeHTML(comment.by || "anon");
    const text = sanitizeHTML(stripHtml(comment.text || "")) || "[commento vuoto]";
    const authorLink = comment.by && comment.by !== "anon"
        ? `<a class="comment-author-link" href="profile.html?user=${encodeURIComponent(comment.by)}">${author}</a>`
        : author;

    wrapper.innerHTML = `
        <p class="comment-meta">${authorLink} - ${sanitizeHTML(comment.timeLabel || "N/D")}</p>
        <div class="comment-text"><p>${text}</p></div>
        <div class="comment-actions"></div>
        <div class="comment-children hidden"></div>
    `;

    const childrenContainer = wrapper.querySelector(".comment-children");
    const actions = wrapper.querySelector(".comment-actions");

    if (Array.isArray(comment.kids) && comment.kids.length > 0) {
        const lazyButton = document.createElement("button");
        lazyButton.type = "button";
        lazyButton.className = "btn btn-secondary";
        lazyButton.textContent = `Mostra risposte (${comment.kids.length})`;

        let loaded = false;

        lazyButton.addEventListener("click", async () => {
            if (loaded) {
                const isHidden = childrenContainer.classList.toggle("hidden");
                lazyButton.textContent = isHidden
                    ? `Mostra risposte (${comment.kids.length})`
                    : "Nascondi risposte";
                return;
            }

            lazyButton.disabled = true;
            lazyButton.textContent = "Caricamento risposte...";

            const children = await getCommentChildren(comment);
            renderCommentsTree(childrenContainer, children, depth + 1);
            childrenContainer.classList.remove("hidden");

            loaded = true;
            lazyButton.disabled = false;
            lazyButton.textContent = "Nascondi risposte";
        });

        actions.appendChild(lazyButton);
    }

    return wrapper;
}

/**
 * Renderizza ricorsivamente un array di commenti all'interno di un container.
 *
 * @param {HTMLElement} container - Elemento DOM che conterrà i commenti
 * @param {Array<object>} comments - Array di commenti mappati
 * @param {number} [depth=0] - Profondità corrente della ricorsione
 * @returns {void}
 *
 * @example
 * renderCommentsTree(containerElement, commentsArray, 0);
 */
export function renderCommentsTree(container, comments, depth = 0) {
    if (!container) {
        return;
    }

    const fragment = document.createDocumentFragment();

    comments
        .filter((comment) => comment && comment.type === "comment")
        .forEach((comment) => {
            fragment.appendChild(createCommentNode(comment, depth));
        });

    if (depth === 0) {
        container.classList.add("thread-container");
    }

    container.appendChild(fragment);
}
