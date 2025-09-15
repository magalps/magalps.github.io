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

// aliases para nomes de botões que não batem 1:1 com as tags
const FILTER_ALIASES = {
  "all": "all",

  // js / node
  "js": "js",
  "nodejs": "nodejs",

  // typescript
  "ts": "typescript",
  "typescript": "typescript",

  // python
  "py": "python",
  "python": "python",

  // html / css
  "html": "html/css",
  "css": "html/css",
  "html/css": "html/css",

  // powerbi
  "pbi": "powerbi",
  "powerbi": "powerbi",

  // sql
  "sql": "sql",

  // java
  "java": "java",

  // c#
  "c#": "c#",
  "csharp": "c#",

  // c++
  "c++": "c++",
  "cpp": "c++",

  // shell
  "sh": "shell",
  "bash": "shell",
  "zsh": "shell",
  "shell": "shell"
};


// filtro DINÂMICO (rebusca os itens sempre)
const filterFunc = function (selectedValue) {
  const items = document.querySelectorAll(".portfolio [data-filter-item]");
  items.forEach((el) => {
    const cats = (el.dataset.category || "").split("|"); // multi-tag
    el.classList.toggle("active", selectedValue === "all" || cats.includes(selectedValue));
  });
};


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

// ===== My skills dinâmico a partir do repoLanguages =====
(async function renderSkillsFromRepoLanguages() {
  const skillsList = document.querySelector('.resume .skills-list');
  const LANG_COLORS = {
  "Python": "#3572A5",
  "JavaScript": "#f1e05a",
  "TypeScript": "#3178c6",
  "HTML": "#e34c26",
  "CSS": "#563d7c",
  "SQL": "#e38c00",
  "Java": "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  "C": "#555555",
  "Go": "#00ADD8",
  "PHP": "#4F5D95",
  "Ruby": "#701516",
  "Rust": "#dea584",
  "Kotlin": "#A97BFF",
  "Swift": "#F05138",
  "Shell": "#89e051"
  // pode expandir conforme precisar
};

  if (!skillsList) return;

  try {
    const res = await fetch('./projects.json?v=' + Date.now(), { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const langs = data.repoLanguages || {};
    const entries = Object.entries(langs);
    if (!entries.length) return;

    const top = entries.slice(0, 8);
    const html = top.map(([name, pct]) => {
      const color = LANG_COLORS[name] || "#0ea5e9"; // fallback = azul do tema
      return `
        <li class="skills-item">
          <div class="title-wrapper">
            <h5 class="h5">${name}</h5>
            <data value="${pct}">${pct}%</data>
          </div>
          <div class="skill-progress-bg">
            <div class="skill-progress-fill"
                style="width:${Math.max(3, pct)}%; background:${color};"></div>
          </div>
        </li>
      `;
    }).join('');

    skillsList.innerHTML = html;
  } catch (e) {
    console.warn('[skills] falha ao carregar repoLanguages:', e);
  }
})();

/* =========================================================
   Resume loader (preenche Educação, Experiência e Cerficado a partir de data/resume.json)
   ========================================================= */
(async function loadResume() {
  const RESUME_URL = './data/resume.json?v=' + Date.now();

  // helpers
  const fmtRange = (s, e) => {
    const start = s ? (s.slice(0, 4)) : '';
    const end = e ? (e.slice(0, 4)) : 'Present';
    return (start || end) ? `${start} — ${end}` : '';
  };

  const findTimelineListByHeading = (headingText) => {
    const sections = document.querySelectorAll('.resume .timeline');
    for (const sec of sections) {
      const h3 = sec.querySelector('.h3');
      if (h3 && h3.textContent.trim().toLowerCase() === headingText.toLowerCase()) {
        return sec.querySelector('.timeline-list');
      }
    }
    return null;
  };

  try {
    const res = await fetch(RESUME_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();

    // Educação
    const eduList = findTimelineListByHeading('Educação');
    if (eduList && Array.isArray(data.education)) {
      eduList.innerHTML = data.education.map(ed => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${ed.institution || ''}</h4>
          <span>${fmtRange(ed.startDate, ed.endDate)}</span>
          <p class="timeline-text">
            ${(ed.studyType ? ed.studyType + (ed.area ? ' — ' + ed.area : '') : (ed.area || '')) || ''}
            ${ed.summary ? ('<br>' + ed.summary) : ''}
          </p>
        </li>
      `).join('');
    }

    // Experiência
    const expList = findTimelineListByHeading('Experiência');
    if (expList && Array.isArray(data.experience)) {
      expList.innerHTML = data.experience.map(ex => `
        <li class="timeline-item">
          <h4 class="h4 timeline-item-title">${ex.position || ''} ${ex.company ? '— ' + ex.company : ''}</h4>
          <span>${fmtRange(ex.startDate, ex.endDate)}</span>
          <p class="timeline-text">${ex.summary || ''}</p>
        </li>
      `).join('');
    }
  } catch (e) {
    console.warn('[resume] falha ao carregar data/resume.json:', e);
    // Sem panic — o conteúdo estático do tema permanece.
  }
})();


/* =========================================================
   Loader de Portfólio (projects.json)
   - Renderiza cards no tema
   - Filtros por tecnologia (tags)
   ========================================================= */

(function initPortfolio() {
  const PROJECTS_JSON_URL = `./projects.json?v=${Date.now()}`; // cache-busting
  const techFilters = [
    "All","JS","NodeJS","TypeScript","Python","HTML/CSS","PowerBI","SQL","Java","C#","C++","Shell"
  ];

  // abrir DIRETO a pasta do projeto no GitHub
  const GITHUB_TREE_BASE = "https://github.com/magalps/magalps.github.io/tree/main/";

  // Placeholder em SVG inline (evita 404)
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

  // utils
  const clamp = (txt, n = 160) => {
    const t = (txt || "").trim();
    return t.length > n ? t.slice(0, n - 1) + "…" : t;
  };
  const escapeHtml = (s) =>
    String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Contêineres do tema
  const filterList = document.querySelector(".portfolio .filter-list");
  const selectList = document.querySelector(".portfolio .select-list");
  const selectValueEl = document.querySelector(".portfolio [data-selecct-value]");
  const projectList = document.querySelector(".portfolio .project-list");

  if (!projectList) return;

  // 1) Monta UI dos filtros com base nos projetos
  function buildFiltersFromProjects(items) {
    const tagSet = new Set();

    // coleta todas as tags dos projetos
    items.forEach(p => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach(t => t && tagSet.add(String(t).trim()));
      }
    });

    // cria array ordenado, adiciona "All" na frente
    const tags = ["All", ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))];

    // renderiza botões (desktop)
    if (filterList) {
      filterList.innerHTML = tags
        .map((t, idx) =>
          `<li class="filter-item"><button data-filter-btn class="${idx === 0 ? "active" : ""}">${t}</button></li>`
        )
        .join("");
    }

    // renderiza select (mobile)
    if (selectList) {
      selectList.innerHTML = tags
        .map(t => `<li class="select-item"><button data-select-item>${t}</button></li>`)
        .join("");
    }

    if (selectValueEl) selectValueEl.textContent = "Select category";

    // conecta os handlers
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
  }


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

      buildFiltersFromProjects(items);

      // cria cada card
      for (const p of items) {
        const meta      = p.meta || {};
        const title     = meta.title || p.dir?.split("/").slice(-1)[0] || "Projeto";
        const img       = meta.imageUrl || "";
        const desc      = clamp(meta.description, 160);
        const progress  = typeof meta.progress === "number" ? Math.max(0, Math.min(100, Math.round(meta.progress))) : null;
        const tags      = Array.isArray(p.tags) && p.tags.length ? p.tags : ["Outros"];

        // dataset-category suporta múltiplas tags (lowercase, separadas por |)
        const dataCategory = tags.map((t) => String(t).toLowerCase()).join("|");

        const progressUI = progress == null ? "" : `
          <div style="display:flex;align-items:center;gap:8px;margin:8px 10px 0 10px;">
            <div style="flex:1;height:6px;border-radius:999px;background:#1f2937;overflow:hidden;">
              <div style="width:${progress}%;height:100%;background:linear-gradient(90deg,#fbbf24,#f59e0b);"></div>
            </div>
            <span class="project-category" style="white-space:nowrap;">${progress}%</span>
          </div>`;

        // link para a PASTA no GitHub
        const href = p.dir ? (GITHUB_TREE_BASE + encodeURI(p.dir)) : "#";

        // ⚠️ renomeado para evitar colisão com qualquer 'li' no escopo
        const cardEl = document.createElement("li");
        cardEl.className = "project-item active";
        cardEl.setAttribute("data-filter-item", "");
        cardEl.setAttribute("data-category", dataCategory);

        cardEl.innerHTML = `
          <a href="${href}" target="_blank" rel="noreferrer">
            <figure class="project-img" style="height:200px;overflow:hidden;background:#0f172a;display:flex;align-items:center;justify-content:center;">
              <div class="project-item-icon-box"><ion-icon name="eye-outline"></ion-icon></div>
              <img src="${img || PLACEHOLDER}" alt="${escapeHtml(title)}" loading="lazy"
                  style="width:100%;height:100%;object-fit:contain;object-position:center;display:block;"
                  onerror="this.onerror=null;this.src='${PLACEHOLDER}'">
            </figure>
            <h3 class="project-title">${escapeHtml(title)}</h3>
            <p class="project-category" style="margin-top:4px;">${escapeHtml(tags.join(" • "))}</p>
            <p class="project-category" style="margin:6px 10px 0 10px;color:var(--light-gray);">${escapeHtml(desc)}</p>
            ${progressUI}
          </a>
        `;

        projectList.appendChild(cardEl);
      }


      // inicia mostrando "All"
      filterFunc("all");
    })
    .catch((err) => {
      console.warn("[portfolio] Erro ao carregar projects.json:", err);
      renderEmpty();
    });

  function renderEmpty() {
    const msg = document.createElement("li");
    msg.className = "project-item active";
    msg.setAttribute("data-filter-item", "");
    msg.setAttribute("data-category", "all");
    msg.innerHTML = `
      <a href="#">
        <figure class="project-img">
          <div class="project-item-icon-box"><ion-icon name="alert-circle-outline"></ion-icon></div>
          <img src="${PLACEHOLDER}" alt="placeholder" loading="lazy">
        </figure>
        <h3 class="project-title">Sem Projetos No Momento</h3>
        <p class="project-category">Verifique se o projects.json foi gerado no deploy</p>
      </a>
    `;
    const ul = document.querySelector(".portfolio .project-list");
    if (ul) {
      ul.innerHTML = "";
      ul.appendChild(msg);
    }
  }
})();

