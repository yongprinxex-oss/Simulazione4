// index.js - home

import { mountFooter } from "../core/footer.js";
import { mountHeader } from "../core/header.js";

/**
 * Inizializza la pagina home montando header e footer.
 *
 * @returns {void}
 *
 * @example
 * init();
 */
function init() {
    mountHeader("home");
    mountFooter();
}

init();
