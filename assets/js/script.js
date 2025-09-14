'use strict';

/* =========================================================
   Comportamentos originais do tema (sidebar, modal, filtros,
   navegação, contato) — mantidos
   ========================================================= */

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn?.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials / modal
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

modalCloseBtn?.addEventListener("click", testimonialsModalFunc);
overlay?.addEventListener("click", testimonialsModalFunc);

// custom select (versão mobile do filtro)
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select?.addEventListener("click", function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filtros (itens estáticos do tema — os projetos dinâmicos também usam isso)
const filterItems = document.querySelectorAll("[data-filter-item]");
const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const cats = (filterItems[i].dataset.category || "").split("|"); // suporta várias tags
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (cats.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// botões de filtro grandes (do tema)
let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    lastClickedBtn?.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// form
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form?.checkValidity()) formBtn?.removeAttribute("disabled");
    else formBtn?.setAttribute("disabled", "");
  });
}

// navegação
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[j].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

/* =========================================================
   Loader de Portfólio (projects.json) para o tema vCard
   - Renderiza cards
   - Filtros por tecnologia (tags)
   ========================================================= */

(function initPortfolio() {
  // Ajuste o caminho se o projects.json estiver em outro lugar
  const PROJECTS_JSON_URL = `${location.origin}/projects.json?v=${Date.now()}`;
  const techFilters = ["All", "JS", "NodeJS", "Python", "HTML/CSS", "PBI", "SQL", "Java"];

  // Contêineres do tema (na página Portfolio)
  const portfolioRoot = document.querySelector("article.portfolio");
  if (!portfolioRoot) return; // página não existe

  const filterList = portfolioRoot.querySelector(".filter-list");
  const selectList = portfolioRoot.querySelector(".select-list");
  const selectValueEl = portfolioRoot.querySelector("[data-selecct-value]");
  const projectList = portfolioRoot.querySelector(".project-list");
  if (!projectList) return;

  // Recria os filtros com as tecnologias desejadas
  if (filterList) {
    filterList.innerHTML = techFilters
      .map((t, i) => `<li class="filter-item"><button data-filter-btn class="${i === 0 ? "active" : ""}">${t}</button></li>`)
      .join("");
  }
  if (selectList) {
    selectList.innerHTML = techFilters
      .map((t) => `<li class="select-item"><button data-select-item>${t}</button></li>`)
      .join("");
  }
  if (selectValueEl) selectValueEl.textContent = "Select category";

  // Conecta eventos nos novos filtros
  const newFilterBtns = portfolioRoot.querySelectorAll("[data-filter-btn]");
  let lastBtn = newFilterBtns[0];
  newFilterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.textContent.trim().toLowerCase();
      if (selectValueEl) selectValueEl.textContent = btn.textContent.trim();
      filterFunc(val);
      lastBtn?.classList.remove("active");
      btn.classList.add("active");
      lastBtn = btn;
    });
  });

  const newSelectItems = portfolioRoot.querySelectorAll("[data-select-item]");
  newSelectItems.forEach((it) => {
    it.addEventListener("click", () => {
      const val = it.textContent.trim().toLowerCase();
      if (selectValueEl) selectValueEl.textContent = it.textContent.trim();
      elementToggleFunc(select);
      filterFunc(val);
    });
  });

  // Placeholder inline (evita 404)
  const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#222"/><stop offset="1" stop-color="#111"/></linearGradient></defs>
        <rect width="100%" height="100%" fill="url(#g)"/>
        <g fill="#FFC857" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">
          <text x="400" y="230" font-size="28">Sem imagem</text>
          <text x="400" y="270" font-size="16" fill="#bbb">projects.json • portfolio</text>
        </g>
      </svg>`
    );

  // Busca e renderiza projetos
  fetch(PROJECTS_JSON_URL)
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const items = Array.isArray(data) ? data : (Array.isArray(data.projects) ? data.projects : []);
      if (!items.length) {
        renderEmpty();
        return;
      }

      // ordena por título
      items.sort((a, b) => (a.meta?.title || "").localeCompare(b.meta?.title || ""));

      // limpa itens de demo
      projectList.innerHTML = "";

      // cria cards
      for (const p of items) {
        const meta = p.meta || {};
        const title = (meta.title || (p.dir?.split("/").slice(-1)[0]) || "Projeto").trim();
        const tags = Array.isArray(p.tags) && p.tags.length ? p.tags : ["Outros"];
        const dataCategory = tags.map((t) => String(t).toLowerCase()).join("|");
        const img = (meta.imageUrl || "").trim();
        const progress = (typeof meta.progress === "number") ? meta.progress : null;
        const warn = !img || progress === null;

        // link prioritário para README; se não houver, para a pasta
        const linkHref = p.readmePath
          ? `./${encodeURI(p.readmePath)}`
          : (p.dir ? `./${encodeURI(p.dir)}` : "#");

        const li = document.createElement("li");
        li.className = "project-item active";
        li.setAttribute("data-filter-item", "");
        li.setAttribute("data-category", dataCategory);

        li.innerHTML = `
          <a href="${linkHref}" target="_blank" rel="noreferrer">
            <figure class="project-img">
              <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
              <img src="${img || PLACEHOLDER}" alt="${escapeHtml(title)}" loading="lazy"
                   onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
            </figure>
            <h3 class="project-title">${escapeHtml(title)}</h3>
            <p class="project-category">${escapeHtml(tags.join(" • "))}</p>
            <div style="display:flex;gap:8px;margin:8px 10px 0 10px;">
              ${progress !== null
                ? `<span class="project-category" title="Progresso">${progress}%</span>`
                : `<span class="project-category" title="Sem progresso">—</span>`}
              ${warn ? `<span class="project-category" title="Metadados incompletos">⚠️</span>` : ``}
            </div>
          </a>
        `;

        projectList.appendChild(li);
      }

      // começa mostrando "all"
      filterFunc("all");
    })
    .catch((err) => {
      console.warn("[portfolio] Falha ao carregar projects.json:", err);
      renderEmpty();
    });

  function renderEmpty() {
    projectList.innerHTML = `
      <li class="project-item active" data-filter-item data-category="all">
        <a href="#">
          <figure class="project-img">
            <div class="project-item-icon-box"><ion-icon name="alert-circle-outline"></ion-icon></div>
            <img src="${PLACEHOLDER}" alt="placeholder" loading="lazy">
          </figure>
          <h3 class="project-title">Sem Projetos No Momento</h3>
          <p class="project-category">Verifique se o projects.json foi gerado no deploy</p>
        </a>
      </li>
    `;
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
