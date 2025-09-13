const GITHUB_USER = "magalps";
const PROJECTS_DIR = "Projetos";

async function loadRepos() {
  try {
    // Lista o conteúdo da pasta Projetos no repositório
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_USER}.github.io/contents/${PROJECTS_DIR}`
    );
    const data = await res.json();

    const grid = document.getElementById("grid");
    if (!Array.isArray(data)) return;

    for (const item of data) {
      if (item.type !== "dir") continue; // só subpastas (projetos)

      const projectName = item.name;

      // Card do projeto
      const card = document.createElement("article");
      card.className = "project";
      card.dataset.tags = "Projetos"; // tag genérica, se quiser pode personalizar depois

      card.innerHTML = `
        <h3>${projectName}</h3>
        <p>Projeto hospedado no GitHub Pages.</p>
        <div class="tags"><span class="tag">GitHub Pages</span></div>
        <a class="btn small" href="https://${GITHUB_USER}.github.io/${PROJECTS_DIR}/${projectName}/" target="_blank">Ver projeto</a>
        <a class="btn small" href="https://github.com/${GITHUB_USER}/${GITHUB_USER}.github.io/tree/main/${PROJECTS_DIR}/${projectName}" target="_blank">Ver código</a>
      `;
      grid.appendChild(card);
    }
  } catch (e) {
    console.error("Erro ao carregar projetos:", e);
  }
}

loadRepos();
