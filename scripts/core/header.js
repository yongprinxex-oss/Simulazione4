// header.js - header riusabile

/**
 * Crea l'elemento header per la pagina corrente con la navigazione.
 *
 * @param {string} [currentPage="home"] - ID della pagina corrente per impostare lo stato attivo
 * @returns {HTMLElement} - Nodo DOM dell'header
 *
 * @example
 * const h = createHeader('top-stories');
 */
export function createHeader(currentPage = "home") {
    const header = document.createElement("header");
    header.className = "header";

    const pages = [
        { name: "Home", path: "index.html", id: "home" },
        { name: "Top Stories", path: "top-stories.html", id: "top-stories" },
        { name: "Thread", path: "thread.html", id: "thread" },
        { name: "Profilo", path: "profile.html", id: "profile" },
        { name: "Read-it-Later", path: "read-later.html", id: "read-later" },
    ];

    const navItems = pages
        .map((page) => {
            const activeClass = page.id === currentPage ? " active" : "";
            return `<li><a href="${page.path}" class="nav-link${activeClass}">${page.name}</a></li>`;
        })
        .join("");

    header.innerHTML = `
        <div class="header-content">
            <h1 class="logo"><a href="index.html">HN Tech Feed</a></h1>
            <nav class="header-nav">
                <ul>${navItems}</ul>
            </nav>
        </div>
    `;

    return header;
}

/**
 * Monta l'header nella pagina (di default in `document.body`).
 *
 * @param {string} [currentPage="home"] - ID della pagina corrente
 * @param {HTMLElement} [container=document.body] - Container dove inserire l'header
 * @returns {void}
 *
 * @example
 * mountHeader('profile');
 */
export function mountHeader(currentPage = "home", container = document.body) {
    container.prepend(createHeader(currentPage));
}
