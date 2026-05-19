// thread.js - story + albero commenti ricorsivo lazy

import { renderCommentsTree } from "../components/thread-comments.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { showEmpty, showError, showLoading, stripHtml } from "../core/errors.js";
import { getCommentChildren, getItemById } from "../services/api.js";

const threadInput = document.getElementById("thread-id-input");
const loadThreadButton = document.getElementById("btn-load-thread");
const threadRoot = document.getElementById("thread-root");

/**
 * Crea l'header della story per la pagina thread (titolo, meta, testo pulito).
 *
 * @param {object} story - Oggetto story mappato
 * @returns {HTMLElement} - Nodo DOM contenente l'header della story
 *
 * @example
 * const node = renderThreadHeader(storyObj);
 */
function renderThreadHeader(story) {
    const wrapper = document.createElement("article");
    wrapper.className = "story-card thread-story-card";

    const cleanText = stripHtml(story.text || "");
    const authorLink = story.by && story.by !== "anon"
        ? `<a href="profile.html?user=${encodeURIComponent(story.by)}">${story.by}</a>`
        : (story.by || "anon");

    wrapper.innerHTML = `
        <h3 class="story-title">${story.title}</h3>
        <p class="story-meta">ID ${story.id} - by ${authorLink} - ${story.timeLabel}</p>
        <p class="story-meta">Score ${story.score} - Commenti ${story.descendants}</p>
        ${cleanText ? `<p>${cleanText}</p>` : ""}
    `;

    return wrapper;
}

/**
 * Carica una story e i suoi commenti di primo livello dato un ID (input dell'utente).
 *
 * @returns {Promise<void>} - Promise che risolve quando il thread è stato renderizzato
 *
 * @example
 * await loadThread();
 */
async function loadThread() {
    const storyId = Number(threadInput.value);

    if (!Number.isFinite(storyId) || storyId <= 0) {
        showError(threadRoot, "ID non valido", "Inserisci un ID story numerico valido.");
        return;
    }

    showLoading(threadRoot, "Caricamento thread...");

    try {
        const story = await getItemById(storyId);

        if (!story || story.type !== "story") {
            showError(threadRoot, "Tipo non valido", "L'ID indicato non corrisponde a una story.");
            return;
        }

        threadRoot.innerHTML = "";
        threadRoot.appendChild(renderThreadHeader(story));

        const commentsContainer = document.createElement("section");
        commentsContainer.className = "thread-container";
        threadRoot.appendChild(commentsContainer);

        if (!Array.isArray(story.kids) || story.kids.length === 0) {
            showEmpty(commentsContainer, "Nessun commento disponibile per questa story.");
            return;
        }

        const firstLevelComments = await getCommentChildren(story);
        renderCommentsTree(commentsContainer, firstLevelComments, 0);
    } catch (error) {
        showError(threadRoot, "Errore", error.message || "Impossibile caricare il thread.");
    }
}

/**
 * Inizializza la pagina thread: monta header/footer e bind degli eventi input.
 *
 * @returns {void}
 *
 * @example
 * init();
 */
function init() {
    mountHeader("thread");
    mountFooter();

    loadThreadButton.addEventListener("click", loadThread);
    threadInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            loadThread();
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialId = params.get("id");

    if (initialId) {
        threadInput.value = initialId;
        loadThread();
        return;
    }

    showEmpty(threadRoot, "Inserisci uno story ID per avviare il caricamento del thread.");
}

init();
