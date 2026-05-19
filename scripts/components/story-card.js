// story-card.js - card news riusabile

import { sanitizeHTML } from "../core/errors.js";

/**
 * Crea una card DOM per una story.
 *
 * @param {object} options - Opzioni di rendering della card
 * @param {object} options.story - Oggetto story mappato
 * @param {boolean} [options.showActions=false] - Mostra i pulsanti di azione
 * @param {boolean} [options.showThreadButton=true] - Mostra il pulsante per aprire il thread
 * @param {string} [options.feedVariant="default"] - Variante di feed (es. "top-stories")
 * @param {boolean} [options.isSaved=false] - Indica se la story è salvata
 * @param {Function} [options.onToggleSave] - Callback per il toggle save
 * @returns {HTMLElement} - Nodo DOM della story card
 *
 * @example
 * const card = createStoryCard({ story: storyObj, showActions: true });
 */
export function createStoryCard({
    story,
    showActions = false,
    showThreadButton = true,
    feedVariant = "default",
    isSaved = false,
    onToggleSave,
}) {
    const card = document.createElement("article");
    card.className = "story-card";

    if (feedVariant === "top-stories") {
        card.classList.add("story-card--feed");
    }

    const title = sanitizeHTML(story.title || "Senza titolo");
    const author = sanitizeHTML(story.by || "anon");
    const meta = `Score ${story.score} - Commenti ${story.descendants} - ${story.timeLabel}`;
    const threadHref = `thread.html?id=${encodeURIComponent(story.id)}`;
    const link = story.url
        ? `<a href="${story.url}" target="_blank" rel="noreferrer">Apri sorgente</a>`
        : `<span>Link non disponibile</span>`;
    const authorLink = author !== "anon"
        ? `<a href="profile.html?user=${encodeURIComponent(story.by)}">${author}</a>`
        : author;
    const titleLink = `<a class="story-title-link" href="${threadHref}">${title}</a>`;

    const actions = showActions
        ? `
            <div class="story-actions">
                ${showThreadButton ? `<a class="btn btn-secondary btn-thread" href="${threadHref}">Apri thread</a>` : ""}
                <button type="button" class="btn btn-secondary btn-save${isSaved ? " is-saved" : ""}" aria-label="${isSaved ? "Rimuovi dall'elenco" : "Salva per dopo"}">${isSaved ? "✕" : "📖"}</button>
            </div>
        `
        : (showThreadButton ? `<a class="btn btn-secondary btn-thread" href="${threadHref}">Apri thread</a>` : "");

    // TODO 1: Completare l'innerHTML della card usando le variabili create precedentemente.
    // Manca da inserire il titleLink dentro un h3 con classe "story-title" dentro il div "story-header".
    // Inserire poi gli story.id e authorLink dentro un paragrafo con classe "story-meta"
    // Infine inserire meta e link nei rispettivi paragrafi con classe "story-meta"
    card.innerHTML = `
        <div class="story-header">
            
            ${actions}
        </div>
        
        
        
    `;

    if (showActions && typeof onToggleSave === "function") {
        const button = card.querySelector(".btn-save");

        button.addEventListener("click", () => {
            onToggleSave(story, button);
        });
    }

    return card;
}

/**
 * Renderizza un elenco di story come card dentro un container.
 *
 * @param {object} options - Opzioni per il rendering
 * @param {HTMLElement} options.container - Container DOM dove appendere le card
 * @param {Array<object>} options.stories - Array di story mappate
 * @param {boolean} [options.showActions=false]
 * @param {boolean} [options.showThreadButton=true]
 * @param {string} [options.feedVariant="default"]
 * @param {Function} [options.isSaved] - Funzione che ritorna se una story è salvata
 * @param {Function} [options.onToggleSave] - Callback per toggle save
 * @returns {void}
 *
 * @example
 * renderStoryCards({ container, stories, showActions: true });
 */
export function renderStoryCards({
    container,
    stories,
    showActions = false,
    showThreadButton = true,
    feedVariant = "default",
    isSaved,
    onToggleSave,
}) {
    if (!container) {
        return;
    }

    container.innerHTML = "";

    stories.forEach((story) => {
        const card = createStoryCard({
            story,
            showActions,
            showThreadButton,
            feedVariant,
            isSaved: typeof isSaved === "function" ? isSaved(story) : false,
            onToggleSave,
        });

        container.appendChild(card);
    });
}
