// storage.js - Persistenza ID read-it-later

const STORAGE_KEYS = {
    READ_LATER: "hn_read_later_ids",
};

/**
 * Normalizza un array di ID: converte in numeri, rimuove duplicati e valori non validi.
 *
 * @param {any} value - Valore da normalizzare (atteso array di ID)
 * @returns {Array<number>} - Array di ID numerici validi
 *
 * @example
 * const ids = normalizeIds(["1", 2, "2", null]);
 * // Restituisce [1, 2]
 */
function normalizeIds(value) {
    if (!Array.isArray(value)) {
        return [];
    }

    return [...new Set(value
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id) && id > 0))];
}

/**
 * Legge gli ID salvati in `localStorage` per la funzionalità read-it-later.
 *
 * @returns {Array<number>} - Array di ID salvati, vuoto se non presenti o in caso di errore
 *
 * @example
 * const ids = readStoredIds();
 */
function readStoredIds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.READ_LATER);
        const parsed = raw ? JSON.parse(raw) : [];
        return normalizeIds(parsed);
    } catch (error) {
        console.error("Errore lettura read-it-later", error);
        return [];
    }
}

/**
 * Scrive l'array di ID normalizzati su `localStorage`.
 *
 * @param {Array<number>} ids - Array di ID da salvare
 * @returns {void}
 *
 * @example
 * writeStoredIds([1,2,3]);
 */
function writeStoredIds(ids) {
    localStorage.setItem(STORAGE_KEYS.READ_LATER, JSON.stringify(normalizeIds(ids)));
}

/**
 * Restituisce gli ID salvati per read-it-later.
 *
 * @returns {Array<number>} - Array di ID salvati
 *
 * @example
 * const saved = getReadLaterIds();
 */
export function getReadLaterIds() {
    return readStoredIds();
}

/**
 * Verifica se un dato ID è nella lista read-it-later.
 *
 * @param {number|string} id - ID dell'item da verificare
 * @returns {boolean} - `true` se presente, `false` altrimenti
 *
 * @example
 * const saved = isReadLater(12345);
 */
export function isReadLater(id) {
    const itemId = Number(id);
    return readStoredIds().includes(itemId);
}

/**
 * Aggiunge un ID alla lista read-it-later.
 *
 * @param {number|string} id - ID dell'item da aggiungere
 * @returns {boolean} - `true` se aggiunto con successo, `false` se non valido o già presente
 *
 * @example
 * const ok = addReadLater(12345);
 */
export function addReadLater(id) {
    const itemId = Number(id);

    if (!Number.isFinite(itemId) || itemId <= 0) {
        return false;
    }

    const ids = readStoredIds();

    if (ids.includes(itemId)) {
        return false;
    }

    ids.push(itemId);

    writeStoredIds(ids);
    return true;
}

/**
 * Rimuove un ID dalla lista read-it-later.
 *
 * @param {number|string} id - ID dell'item da rimuovere
 * @returns {void}
 *
 * @example
 * removeReadLater(12345);
 */
export function removeReadLater(id) {
    const itemId = Number(id);
    const ids = readStoredIds().filter((entry) => entry !== itemId);
    writeStoredIds(ids);
}

/**
 * Fa il toggle dello stato read-it-later per un ID (aggiunge o rimuove).
 *
 * @param {number|string} id - ID dell'item da togglare
 * @returns {boolean} - `true` se dopo l'operazione è presente nella lista, `false` altrimenti
 *
 * @example
 * const nowSaved = toggleReadLater(12345);
 */
export function toggleReadLater(id) {
    if (isReadLater(id)) {
        removeReadLater(id);
        return false;
    }

    addReadLater(id);
    return true;
}

/**
 * Svuota completamente la lista read-it-later.
 *
 * @returns {void}
 *
 * @example
 * clearReadLater();
 */
export function clearReadLater() {
    writeStoredIds([]);
}
