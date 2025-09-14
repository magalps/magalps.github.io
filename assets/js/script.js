'use strict';

/* =========================
   vCard original behavior
   ========================= */

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");
// sidebar toggle functionality for mobile
if (sidebarBtn) sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  if (!modalContainer || !overlay) return;
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {
  testimonialsItem[i].addEventListener("click", function () {
    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;
    testimonialsModalFunc();
  });
}

// add click event to modal close button
if (modalCloseBtn) modalCloseBtn.addEventListener("click", testimonialsModalFunc);
if (overlay) overlay.addEventListener("click", testimonialsModalFunc);

// custom select variables
const select = document.querySelector("[data-select]");
let selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
let filterBtn = document.querySelectorAll("[data-filter-btn]");

if (select) select.addEventListener("click", function () { elementToggleFunc(this); });

// filter variables (will be repurposed later)
let filterItems = document.querySelectorAll("[data-filter-item]");

// generic filter function (will accept multi-tag items)
const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    const cats = (filterItems[i].dataset.category || "").split(" ").map(s => s.trim()).filter(Boolean);
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (cats.includes(selectedValue)) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0] || null;
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = (this.innerText || "").toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    filterFunc(selectedValue);
    if (lastClickedBtn) lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    if (form && form.checkValidity()) {
      if (formBtn) formBtn.removeAttribute("disabled");
    } else {
      if (formBtn) formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
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

/* ==========================================
   PORTFOLIO – dynamic projects from projects.json
   ========================================== */

(function loadPortfolioFromJson(){
  const PROJECTS_JSON_URL = "./projects.json?v=" + Date.now(); // cache-busting leve
  const projectListEl = document.querySelector(".portfolio .project-list");
  const filterListEl  = document.querySelector(".portfolio .filter-list");
  const selectListEl  = document.querySelector(".portfolio .select-list");

  if (!projectListEl) return;

  // Normaliza tags para as opções desejadas
  const normalizeTag = (t) => {
    const s = (t || "").toLowerCase();
    if (["js","javascript","ts","typescript"].includes(s)) return "js";
    if (["node","nodejs"].includes(s)) return "nodejs";
    if (["python","py"].includes(s)) return "python";
    if (["html","css","html/css","frontend"].includes(s)) return "html/css";
    if (["powerbi","pbi","power bi"].includes(s)) return "pbi";
    if (["sql","t-sql","tsql","postgres","mysql"].includes(s)) return "sql";
    if (["java"].includes(s)) return "java";
    return null;
  };

  // Trunca texto com reticências
  const ellipsis = (str, max=120) => {
    if (!str) return "";
    return (str.length > max) ? str.slice(0, max - 1).trimEnd() + "…" : str;
  };

  // Gera URL de publicação para a pasta
  const toLiveUrl = (dir) => {
    // publica como /Projetos/.../
    const clean = (dir || "").replace(/^\/+/, "");
    return `/${clean.replace(/\/+$/,"")}/`;
  };

  // Renderiza UM card <li>
  const renderItem = (proj) => {
    const title = proj?.meta?.title || proj?.dir?.split("/").pop() || "Projeto";
    const desc  = ellipsis(proj?.meta?.description || "", 110);
    const img   = proj?.meta?.imageUrl || "";
    const prog  = typeof proj?.meta?.progress === "number" ? proj.meta.progress : null;
    const warn  = (!img || prog == null) ? " ⚠️" : "";
    const tags  = Array.isArray(proj?.tags) ? proj.tags.map(normalizeTag).filter(Boolean) : [];
    const dataCategory = tags.join(" "); // ex: "js nodejs"
    const href  = toLiveUrl(proj?.dir || "");

    // Figure + overlay + badge de progresso (se houver)
    return `
      <li class="project-item active" data-filter-item data-category="${dataCategory}">
        <a href="${href}">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            ${img
              ? `<img src="${img}" alt="${title}" loading="lazy" onerror="this.style.display='none'">`
              : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;background:#222;color:#aaa">sem imagem</div>`
            }
            ${prog != null ? `<div style="
                position:absolute;bottom:8px;right:8px;
                background:rgba(0,0,0,.6);color:#ffd166;
                padding:4px 8px;border-radius:10px;font-size:12px;border:1px solid rgba(255,255,255,.1)
              ">${prog}%</div>` : ``}
          </figure>
          <h3 class="project-title">${title}${warn}</h3>
          <p class="project-category">${tags.length ? tags.map(t=>t.toUpperCase()).join(" • ") : "OUTROS"}</p>
          ${desc ? `<p class="project-category" style="opacity:.8">${desc}</p>` : ``}
        </a>
      </li>
    `;
  };

  // Constrói/atualiza a barra de filtros (botões) e o select, com base nas tags existentes
  const setupFiltersUI = (allTags) => {
    // Ordem desejada
    const order = ["all","js","nodejs","python","html/css","pbi","sql","java"];
    const unique = Array.from(new Set(allTags));
    const tagsOrdered = order.filter(t => t==="all" || unique.includes(t));

    // --- Botões (desktop) ---
    if (filterListEl) {
      filterListEl.innerHTML = ""; // limpa itens padrão
      tagsOrdered.forEach((t,i)=>{
        const li = document.createElement("li");
        li.className = "filter-item";
        li.innerHTML = `<button data-filter-btn class="${i===0?"active":""}">${t==="all"?"All":t.toUpperCase()}</button>`;
        filterListEl.appendChild(li);
      });
      // rebind
      filterBtn = document.querySelectorAll("[data-filter-btn]");
      // default select value
      if (selectValue) selectValue.innerText = (tagsOrdered[0]==="all"?"All":tagsOrdered[0].toUpperCase());

      // click handlers
      let last = filterBtn[0] || null;
      for (let i = 0; i < filterBtn.length; i++) {
        filterBtn[i].addEventListener("click", function () {
          let selectedValue = (this.innerText || "").toLowerCase();
          if (selectValue) selectValue.innerText = this.innerText;
          filterFunc(selectedValue);
          if (last) last.classList.remove("active");
          this.classList.add("active");
          last = this;
        });
      }
    }

    // --- Select (mobile) ---
    if (selectListEl) {
      selectListEl.innerHTML = "";
      tagsOrdered.forEach((t)=>{
        const li = document.createElement("li");
        li.className = "select-item";
        li.innerHTML = `<button data-select-item>${t==="all"?"All":t.toUpperCase()}</button>`;
        selectListEl.appendChild(li);
      });
      // rebind
      selectItems = document.querySelectorAll("[data-select-item]");
      for (let i = 0; i < selectItems.length; i++) {
        selectItems[i].addEventListener("click", function () {
          let selectedValue = (this.innerText || "").toLowerCase();
          if (selectValue) selectValue.innerText = this.innerText;
          if (select) elementToggleFunc(select);
          filterFunc(selectedValue);
        });
      }
    }
  };

  // Fetch & render
  fetch(PROJECTS_JSON_URL)
    .then(r=>{
      if(!r.ok) throw new Error("Falha ao carregar projects.json ("+r.status+")");
      return r.json();
    })
    .then(data=>{
      const arr = Array.isArray(data?.projects) ? data.projects : [];
      if (!arr.length) return;

      // render cards
      const html = arr.map(renderItem).join("");
      projectListEl.innerHTML = html;

      // atualizar referência dos itens para o filtro funcionar
      filterItems = document.querySelectorAll("[data-filter-item]");

      // coletar tags existentes
      const allTags = [];
      arr.forEach(p=>{
        (Array.isArray(p.tags)?p.tags:[]).forEach(t=>{
          const n = normalizeTag(t);
          if (n) allTags.push(n);
        });
      });
      allTags.unshift("all");
      setupFiltersUI(allTags);

      // estado inicial = All
      filterFunc("all");
    })
    .catch(err=>{
      console.warn("[portfolio] erro carregando projects.json:", err);
    });
})();
