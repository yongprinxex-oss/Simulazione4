// top-stories.js - feed principale con fetch concorrenti batch

import { renderStoryCards } from "../components/story-card.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { showEmpty } from "../core/errors.js";
import { loadCollection } from "../core/page-loader.js";
import { getTopStoriesDetailed } from "../services/api.js";
import { isReadLater, toggleReadLater } from "../services/storage.js";

const limitSelect = document.getElementById("limit-select");
const refreshButton = document.getElementById("btn-refresh");
const feedContainer = document.getElementById("stories-feed");
const BATCH_SIZE = 20;

/**
 * Renderizza il feed di stories nella pagina principale.
 *
 * @param {Array<object>} stories - Array di story mappate da visualizzare
 * @returns {void}
 *
 * @example
 * renderFeed([{ id: 1, title: 'Titolo' }]);
 */
function renderFeed(stories) {
    renderStoryCards({
        container: feedContainer,
        stories,
        showActions: true,
        showThreadButton: false,
        feedVariant: "top-stories",
        isSaved: (story) => isReadLater(story.id),
        onToggleSave: (story, button) => {
            const saved = toggleReadLater(story.id);
            button.textContent = saved ? "✕" : "📖";
            button.classList.toggle("is-saved", saved);
        },
    });
}

/**
 * Carica le top stories usando `loadCollection` e le renderizza.
 *
 * @returns {Promise<void>} - Promise che risolve quando il caricamento è completato
 *
 * @example
 * await loadTopStories();
 */
async function loadTopStories() {
    const total = Number(limitSelect.value);

    await loadCollection({
        container: feedContainer,
        loadingMessage: "Caricamento top stories...",
        emptyMessage: "Nessuna top story disponibile.",
        request: () => getTopStoriesDetailed({ total, batchSize: BATCH_SIZE }),
        render: renderFeed,
    });
}

/**
 * Inizializza la pagina delle top stories: monta header/footer e bind degli eventi.
 *
 * @returns {void}
 *
 * @example
 * init();
 */
function init() {
    mountHeader("top-stories");
    mountFooter();

    refreshButton.addEventListener("click", loadTopStories);
    limitSelect.addEventListener("change", loadTopStories);

    showEmpty(feedContainer, "Caricamento feed in corso...");
    loadTopStories();
}

init();
