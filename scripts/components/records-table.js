// records-table.js - tabella riusabile

import { sanitizeHTML } from "../core/errors.js";

/**
 * Renderizza una tabella di record generica con colonne configurabili e azioni opzionali.
 *
 * @param {object} options - Opzioni di rendering
 * @param {HTMLElement} options.container - Container DOM dove inserire la tabella
 * @param {string} options.emptyMessage - Messaggio da mostrare se non ci sono record
 * @param {Array<object>} options.records - Array di record da visualizzare
 * @param {Array<object>} options.columns - Definizione delle colonne ({ header, render })
 * @param {Function} [options.onDelete] - Callback per la cancellazione di una riga
 * @param {Function} [options.onDeleteAll] - Callback per cancellare tutti i record
 * @param {string} [options.clearAllLabel] - Label bottone cancella tutti
 * @param {string} [options.deleteLabel] - Label bottone rimuovi riga
 * @returns {void}
 *
 * @example
 * renderRecordsTable({ container, emptyMessage: 'Vuoto', records: [], columns: [] });
 */
export function renderRecordsTable({
    container,
    emptyMessage,
    records,
    columns,
    onDelete,
    onDeleteAll,
    clearAllLabel = "Cancella tutti",
    deleteLabel = "Rimuovi",
}) {
    if (!container) {
        return;
    }

    if (!Array.isArray(records) || records.length === 0) {
        container.innerHTML = `<div class="empty">${sanitizeHTML(emptyMessage)}</div>`;
        return;
    }

    const withActions = typeof onDelete === "function";
    const headers = columns.map((column) => `<th>${sanitizeHTML(column.header)}</th>`).join("");
    const finalHeaders = withActions ? `${headers}<th>Azioni</th>` : headers;

    const rows = records
        .map((record, index) => {
            const cells = columns
                .map((column) => `<td>${sanitizeHTML(String(column.render(record, index)))}</td>`)
                .join("");
            const actionCell = withActions
                ? `<td><button type="button" class="btn btn-danger btn-delete" data-row="${index}">${deleteLabel}</button></td>`
                : "";

            return `<tr class="records-row">${cells}${actionCell}</tr>`;
        })
        .join("");

    container.innerHTML = `
        <section class="records-panel">
            <div class="records-header">
                ${typeof onDeleteAll === "function" ? `<button id="btn-clear-all" class="btn btn-danger" type="button">${sanitizeHTML(clearAllLabel)}</button>` : ""}
            </div>
            <div class="records-table-wrapper">
                <table class="records-table">
                    <thead><tr>${finalHeaders}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </section>
    `;

    if (withActions) {
        const deleteButtons = container.querySelectorAll(".btn-delete");

        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const index = Number(button.dataset.row);
                onDelete(records[index]);
            });
        });
    }

    if (typeof onDeleteAll === "function") {
        container.querySelector("#btn-clear-all")?.addEventListener("click", () => {
            const confirmed = confirm("Vuoi svuotare completamente la lista?");

            if (confirmed) {
                onDeleteAll();
            }
        });
    }
}
