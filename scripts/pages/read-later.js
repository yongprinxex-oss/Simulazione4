// read-later.js - re-idratazione async articoli salvati

import { renderStoryCards } from "../components/story-card.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { showEmpty, showError, showLoading } from "../core/errors.js";
import { getItemsByIds } from "../services/api.js";
import { clearReadLater, getReadLaterIds, isReadLater, toggleReadLater } from "../services/storage.js";

const feedContainer = document.getElementById("read-later-feed");
const controlsContainer = document.getElementById("read-later-controls");

/**
 * Renderizza i controlli della pagina read-later (pulsante per svuotare la lista).
 *
 * @returns {void}
 *
 * @example
 * renderControls();
 */
function renderControls() {
    if (!controlsContainer) {
        return;
    }

    controlsContainer.innerHTML = `
        <div class="records-header records-header--stacked read-later-actions">
            <button type="button" class="btn btn-danger" id="btn-clear-all">Svuota lista</button>
        </div>
    `;

    controlsContainer.querySelector("#btn-clear-all")?.addEventListener("click", () => {
        const confirmed = confirm("Vuoi rimuovere tutti gli articoli salvati?");

        if (confirmed) {
            clearReadLater();
            hydrateReadLater();
        }
    });
}

/**
 * Renderizza le story salvate nella sezione read-later.
 *
 * @param {Array<object>} stories - Array di story mappate
 * @returns {void}
 *
 * @example
 * renderSavedStories(storiesArray);
 */
function renderSavedStories(stories) {
    renderStoryCards({
        container: feedContainer,
        stories,
        showActions: true,
        showThreadButton: true,
        feedVariant: "read-later",
        isSaved: (story) => isReadLater(story.id),
        onToggleSave: (_story) => {
            toggleReadLater(_story.id);
            hydrateReadLater();
        },
    });
}

/**
 * Re-idrata la lista read-later leggendo gli ID e recuperando le story corrispondenti.
 *
 * @returns {Promise<void>} - Promise che risolve quando la lista è stata renderizzata
 *
 * @example
 * await hydrateReadLater();
 */
async function hydrateReadLater() {
    const ids = getReadLaterIds();

    if (ids.length === 0) {
        showEmpty(feedContainer, "Nessun articolo salvato in read-it-later.");
        return;
    }

    showLoading(feedContainer, "Re-idratazione articoli salvati...");

    try {
        const stories = await getItemsByIds(ids);
        const filtered = stories.filter((item) => item && (item.type === "story" || item.type === "job"));

        if (filtered.length === 0) {
            showEmpty(feedContainer, "Gli ID salvati non hanno restituito articoli validi.");
            return;
        }

        renderSavedStories(filtered);
    } catch (error) {
        showError(feedContainer, "Errore", error.message || "Impossibile recuperare la lista salvata.");
    }
}

/**
 * Inizializza la pagina read-later: monta header/footer e avvia l'idratazione.
 *
 * @returns {void}
 *
 * @example
 * init();
 */
function init() {
    mountHeader("read-later");
    mountFooter();

    renderControls();
    hydrateReadLater();
}

init();
