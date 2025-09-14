'use strict';

/* ====== (SEU CÓDIGO ORIGINAL DO TEMA) ====== */

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
    if (!modalImg || !modalTitle || !modalText) return;
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

// filter variables (do tema)
let filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === (filterItems[i].dataset.category || "")) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
};

// add event in all select items (do tema - vamos re-ligar depois que recriarmos a lista)
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    if (selectValue) selectValue.innerText = this.innerText;
    if (select) elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// add event in all filter button items for large screen (do tema - vamos re-ligar depois)
let lastClickedBtn = filterBtn[0] || null;
for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
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
    if (!form || !formBtn) return;
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");
// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }
  });
}

/* ====== FIM do código original ====== */


/* ====== === PORTFOLIO: integrar com GitHub === ====== */

(function integratePortfolio() {
  const GH_USER = 'magalps';
  const REPO = 'magalps.github.io';
  const PROJECTS_DIR = 'Projetos';

  // etiquetas que queremos nos filtros
  const TECHS = [
    { label: 'All', key: 'all' },
    { label: 'JS', key: 'js' },
    { label: 'NodeJS', key: 'nodejs' },
    { label: 'Python', key: 'python' },
    { label: 'HTML/CSS', key: 'html/css' },
    { label: 'PBI', key: 'pbi' },          // alias de PowerBI
    { label: 'SQL', key: 'sql' },
    { label: 'Java', key: 'java' },
  ];

  // normalização de tags vindas do manifesto
  const normTag = (t) => {
    if (!t) return null;
    const s = String(t).toLowerCase();
    if (s === 'powerbi' || s === 'power bi' || s === 'pbi') return 'pbi';
    if (s === 'html' || s === 'css' || s === 'html/css' || s === 'html-css') return 'html/css';
    if (s === 'js' || s === 'javascript' || s === 'typescript' || s === 'ts') return 'js';
    if (s === 'node' || s === 'nodejs' || s === 'node.js') return 'nodejs';
    if (s === 'py' || s === 'python') return 'python';
    if (s.includes('sql')) return 'sql';
    if (s === 'java') return 'java';
    return null;
  };

  // UI roots do tema
  const projectListEl = document.querySelector('.project-list');
  const filterListEl  = document.querySelector('.filter-list');
  const selectListEl  = document.querySelector('.select-list');
  const selectValueEl = document.querySelector('[data-selecct-value]');

  if (!projectListEl) return; // nada a fazer se a seção não existe

  // cria filtros (botões) por tecnologia
  function buildFilterButtons() {
    if (!filterListEl) return;

    filterListEl.innerHTML = '';
    TECHS.forEach((t, idx) => {
      const li = document.createElement('li');
      li.className = 'filter-item';
      li.innerHTML = `<button class="${idx===0?'active':''}" data-filter-btn data-key="${t.key}">${t.label}</button>`;
      filterListEl.appendChild(li);
    });

    // liga eventos próprios (não dependemos do NodeList inicial do tema)
    filterListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter-btn]');
      if (!btn) return;
      const key = btn.dataset.key;
      // estado visual
      filterListEl.querySelectorAll('[data-filter-btn].active').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      if (selectValueEl) selectValueEl.textContent = btn.textContent;
      // aplica filtro
      applyFilter(key);
    });
  }

  // cria opções do select (mobile)
  function buildSelectItems() {
    if (!selectListEl) return;
    selectListEl.innerHTML = '';
    TECHS.forEach(t => {
      const li = document.createElement('li');
      li.className = 'select-item';
      li.innerHTML = `<button data-select-item data-key="${t.key}">${t.label}</button>`;
      selectListEl.appendChild(li);
    });

    // ligar eventos próprios
    selectListEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-select-item]');
      if (!btn) return;
      const key = btn.dataset.key;
      if (selectValueEl) selectValueEl.textContent = btn.textContent;
      if (select) select.classList.remove('active');
      applyFilter(key);
    });
  }

  // aplica filtro usando data-tags (múltiplas tags por item)
  function applyFilter(key) {
    const items = projectListEl.querySelectorAll('[data-filter-item]');
    items.forEach(li => {
      const tags = (li.getAttribute('data-tags') || '').split(',').map(s=>s.trim()).filter(Boolean);
      if (key === 'all' || tags.includes(key)) {
        li.classList.add('active');
      } else {
        li.classList.remove('active');
      }
    });
  }

  // cria 1 <li> por tag (para compatibilidade total com o filtro antigo)
  function createProjectLis(project) {
    const lis = [];
    const tags = (project.tags || []).map(normTag).filter(Boolean);
    const unique = Array.from(new Set(tags));
    const shownTagsText = unique.map(k => {
      const t = TECHS.find(x=>x.key===k);
      return t ? t.label : k;
    }).join(' • ');

    // se não veio nenhuma tag, cai em 'all'
    const tagKeys = unique.length ? unique : ['all'];

    tagKeys.forEach(tagKey => {
      const li = document.createElement('li');
      li.className = 'project-item active';
      li.setAttribute('data-filter-item', '');
      li.setAttribute('data-category', tagKey);
      li.setAttribute('data-tags', unique.join(',')); // para applyFilter

      const liveUrl = project.live || `https://${GH_USER}.github.io/${PROJECTS_DIR}/${encodeURIComponent(project.folder||project.name||'')}/`;
      const img = project.image || project.cover || './assets/images/project-1.jpg';

      li.innerHTML = `
        <a href="${liveUrl}" target="_blank" rel="noreferrer">
          <figure class="project-img">
            <div class="project-item-icon-box">
              <ion-icon name="eye-outline"></ion-icon>
            </div>
            <img src="${img}" alt="${escapeHtml(project.title || project.name || 'Projeto')}" loading="lazy" style="object-fit:contain;object-position:center;background:#0f172a;">
          </figure>
          <h3 class="project-title">${escapeHtml(project.title || project.name || 'Projeto')}</h3>
          <p class="project-category">${escapeHtml(shownTagsText || 'Projeto')}</p>
        </a>
      `;
      lis.push(li);
    });

    return lis;
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  // monta a lista no DOM
  function renderProjects(projects) {
    projectListEl.innerHTML = '';
    const frag = document.createDocumentFragment();
    projects.forEach(p => {
      createProjectLis(p).forEach(li => frag.appendChild(li));
    });
    projectListEl.appendChild(frag);

    // atualizar referência que o script original usa
    filterItems = document.querySelectorAll("[data-filter-item]");

    // aplica filtro inicial (All)
    applyFilter('all');
  }

  // tenta carregar projects.json do próprio site (criado pelo workflow)
  async function loadFromManifest() {
    const url = './projects.json?cb=' + Date.now();
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('projects.json HTTP ' + res.status);
    const data = await res.json();

    // formatos tolerados:
    // A) { projects: [ {name,title,folder,image,tags,live,description} ] }
    // B) [ { ... } ]
    const list = Array.isArray(data) ? data : Array.isArray(data.projects) ? data.projects : [];
    // map defensivo
    return list.map(it => ({
      name: it.name || it.title || '',
      title: it.title || it.name || '',
      folder: it.folder || it.path?.split('/').pop() || it.name || '',
      image: it.image || it.readme?.image || '',
      tags: it.tags || it.readme?.tags || it.techs || it.languages || [],
      live: it.live || it.homepage || '',
      description: it.description || it.readme?.description || ''
    }));
  }

  // fallback leve (se manifesto faltar): nada quebra, mantém a lista estática do tema
  async function safeLoadProjects() {
    try {
      const items = await loadFromManifest();
      if (!items.length) return;
      buildFilterButtons();
      buildSelectItems();
      renderProjects(items);
      console.log('[portfolio] carregado via projects.json:', items.length, 'itens');
    } catch (e) {
      console.warn('[portfolio] fallback: mantendo projetos estáticos –', e.message || e);
    }
  }

  // inicia quando a aba "portfolio" existir
  safeLoadProjects();
})();
