// profile.js - profilo utente + attivita recenti

import { renderRecordsTable } from "../components/records-table.js";
import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";
import { sanitizeHTML, showEmpty, showError, showLoading, stripHtml } from "../core/errors.js";
import { getUserSubmittedItems } from "../services/api.js";

const userInput = document.getElementById("user-id-input");
const loadUserButton = document.getElementById("btn-load-user");
const profileContainer = document.getElementById("user-profile");
const activityContainer = document.getElementById("user-activity");

/**
 * Renderizza il profilo utente nella sezione profilo.
 *
 * @param {object} user - Oggetto utente ottenuto dall'API
 * @returns {void}
 *
 * @example
 * renderProfile(userObj);
 */
function renderProfile(user) {
    const card = document.createElement("article");
    card.className = "user-profile-card";

    card.innerHTML = `
        <h3>${sanitizeHTML(user.id)}</h3>
        <p class="user-meta"><strong>Karma:</strong> ${user.karma}</p>
        <p class="user-meta"><strong>Creato il:</strong> ${sanitizeHTML(user.createdLabel)}</p>
        ${user.about ? `<p>${sanitizeHTML(stripHtml(user.about))}</p>` : ""}
    `;

    profileContainer.innerHTML = "";
    profileContainer.appendChild(card);
}

/**
 * Renderizza la tabella delle attività dell'utente.
 *
 * @param {Array<object>} items - Array di item inviati dall'utente
 * @returns {void}
 *
 * @example
 * renderActivity(itemsArray);
 */
function renderActivity(items) {
    renderRecordsTable({
        container: activityContainer,
        emptyMessage: "Nessuna attivita recente disponibile.",
        records: items,
        columns: [
            { header: "ID", render: (item) => item.id },
            { header: "Tipo", render: (item) => item.type },
            {
                header: "Titolo/Testo",
                render: (item) => {
                    const titleText = stripHtml(item.title || "").trim();
                    const textSnippet = stripHtml(item.text || "").trim();
                    const fallback = titleText || textSnippet || (item.url ? item.url : "");
                    return fallback ? fallback.slice(0, 90) : "N/D";
                },
            },
            { header: "Autore", render: (item) => item.by },
            { header: "Data", render: (item) => item.timeLabel },
        ],
    });
}



async function loadProfile() {
    const userId = userInput.value.trim();

    if (!userId) {
        showError(profileContainer, "Input mancante", "Inserisci uno username Hacker News.");
        return;
    }

    showLoading(profileContainer, "Caricamento profilo...");
    showLoading(activityContainer, "Caricamento attivita...");

    try {
        const { user, items } = await getUserSubmittedItems(userId, 10);

        renderProfile(user);
        renderActivity(items);
    } catch (error) {
        showError(profileContainer, "Errore", error.message || "Impossibile recuperare il profilo.");
        showEmpty(activityContainer, "");
    }
}

function init() {
    mountHeader("profile");
    mountFooter();

    loadUserButton.addEventListener("click", loadProfile);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            loadProfile();
        }
    });

    const params = new URLSearchParams(window.location.search);
    const initialUser = params.get("user");

    if (initialUser) {
        userInput.value = initialUser;
        loadProfile();
        return;
    }

    showEmpty(profileContainer, "Inserisci uno username per visualizzare il profilo.");
    showEmpty(activityContainer, "Le ultime attivita verranno mostrate qui.");
}

init();
