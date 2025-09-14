'use strict';

/* =========================================================
   Comportamentos originais do tema (sidebar, modal, filtros,
   navegação, contato) — mantidos exatamente como estavam
   ========================================================= */

const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

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

modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);

// custom select (usado na versão mobile do filtro)
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select?.addEventListener("click", function () { elementToggleFunc(this); });

for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

const filterItems = document.querySelectorAll("[data-filter-item]");
const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const cats = (filterItems[i].dataset.category || "").split("|"); // suporte multi-tag
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (cats.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

let lastClickedBtn = filterBtn[0];
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
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
    if (form.checkValidity()) formBtn.removeAttribute("disabled");
    else formBtn.setAttribute("disabled", "");
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
   Loader de Portfólio (projects.json)
   - Renderiza cards no tema
   - Filtros por tecnologia (tags)
   ========================================================= */

(function initPortfolio() {
  const PROJECTS_JSON_URL = `./projects.json?v=${Date.now()}`; // cache-busting
  const techFilters = ["All", "JS", "NodeJS", "Python", "HTML/CSS", "PBI", "SQL", "Java"];

  // Contêineres do tema
  const filterList = document.querySelector(".portfolio .filter-list");
  const selectList = document.querySelector(".portfolio .select-list");
  const selectValueEl = document.querySelector(".portfolio [data-selecct-value]");
  const projectList = document.querySelector(".portfolio .project-list");

  if (!projectList) return; // página não encontrada/alterada

  // 1) Monta UI dos filtros (substitui existentes pelo conjunto de tecnologias)
  if (filterList) {
    filterList.innerHTML = techFilters
      .map((t, idx) =>
        `<li class="filter-item"><button data-filter-btn class="${idx === 0 ? "active" : ""}">${t}</button></li>`
      )
      .join("");
  }
  if (selectList) {
    selectList.innerHTML = techFilters
      .map((t) => `<li class="select-item"><button data-select-item>${t}</button></li>`)
      .join("");
  }
  if (selectValueEl) selectValueEl.textContent = "Select category";

  // Reconecta handlers agora que recriamos a UI de filtros
  const newFilterBtns = document.querySelectorAll(".portfolio [data-filter-btn]");
  let lastBtn = newFilterBtns[0];
  newFilterBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      const val = btn.textContent.trim().toLowerCase();
      if (selectValueEl) selectValueEl.textContent = btn.textContent.trim();
      filterFunc(val);
      lastBtn?.classList.remove("active");
      btn.classList.add("active");
      lastBtn = btn;
    })
  );

  const newSelectItems = document.querySelectorAll(".portfolio [data-select-item]");
  newSelectItems.forEach((it) =>
    it.addEventListener("click", () => {
      const val = it.textContent.trim().toLowerCase();
      if (selectValueEl) selectValueEl.textContent = it.textContent.trim();
      elementToggleFunc(select);
      filterFunc(val);
    })
  );

  // 2) Busca e renderiza
  fetch(PROJECTS_JSON_URL)
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const items = Array.isArray(data?.projects) ? data.projects : [];
      if (!items.length) {
        renderEmpty();
        return;
      }

      // limpa lista (remove os itens de demo do tema)
      projectList.innerHTML = "";

      // cria cada card
      for (const p of items) {
        const meta = p.meta || {};
        const title = meta.title || p.dir?.split("/").slice(-1)[0] || "Projeto";
        const desc = (meta.description || "").trim();
        const img = meta.imageUrl || "";
        const progress = typeof meta.progress === "number" ? meta.progress : null;
        const tags = Array.isArray(p.tags) && p.tags.length ? p.tags : ["Outros"];

        // dataset-category suporta múltiplas tags (lowercase, separadas por |)
        const dataCategory = tags.map((t) => t.toLowerCase()).join("|");

        // badges
        const warn = !img || progress === null;
        const progressBadge = progress !== null
          ? `<span class="project-category" title="Progresso">${progress}%</span>`
          : `<span class="project-category" title="Sem progresso">—</span>`;
        const warnBadge = warn ? `<span class="project-category" title="Metadados incompletos">⚠️</span>` : "";

        // link do projeto — tenta README se existir, senão pasta
        const linkHref = p.readmePath
          ? `./${encodeURI(p.readmePath)}`
          : `./${encodeURI(p.dir || "")}`;

        const li = document.createElement("li");
        li.className = "project-item active";
        li.setAttribute("data-filter-item", "");
        li.setAttribute("data-category", dataCategory);
        li.innerHTML = `
          <a href="${linkHref}" target="_blank" rel="noreferrer">
            <figure class="project-img">
              <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
              <img src="${img || "./assets/images/project-placeholder.png"}" alt="${title}" loading="lazy"
                   onerror="this.src='./assets/images/project-placeholder.png'">
            </figure>
            <h3 class="project-title">${escapeHtml(title)}</h3>
            <p class="project-category">${escapeHtml(tags.join(" • "))}</p>
            <div style="display:flex;gap:8px;margin:8px 10px 0 10px;">
              ${progressBadge}${warnBadge}
            </div>
          </a>
        `;
        projectList.appendChild(li);
      }

      // inicia mostrando "All"
      filterFunc("all");
    })
    .catch((err) => {
      console.warn("[portfolio] Erro ao carregar projects.json:", err);
      renderEmpty();
    });

  function renderEmpty() {
    projectList.innerHTML = `
      <li class="project-item active" data-filter-item data-category="all">
        <a href="#">
          <figure class="project-img">
            <div class="project-item-icon-box"><ion-icon name="alert-circle-outline"></ion-icon></div>
            <img src="./assets/images/project-placeholder.png" alt="placeholder" loading="lazy">
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
