import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, 'Projetos');

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);
const EXCLUDE = new RegExp('(^|/)(node_modules|\\.venv|venv|__pycache__|dist|build|coverage|\\.next|\\.nuxt|\\.cache|vendor|deps|third[-_]?party|site-packages|dist-packages|packages|\\.husky|\\.git)(/|$)','i');

// --- mapear extensões -> linguagem (ajuste se quiser) ---
const EXT_MAP = {
  ".js": "JavaScript", ".mjs": "JavaScript", ".jsx": "JavaScript",
  ".ts": "TypeScript", ".tsx": "TypeScript",
  ".py": "Python",
  ".java": "Java",
  ".cs": "C#",
  ".cpp": "C++", ".cc": "C++", ".cxx": "C++",
  ".c": "C",
  ".sql": "SQL",
  ".html": "HTML",
  ".css": "CSS", ".scss": "CSS", ".sass": "CSS",
  ".sh": "Shell",
  ".go": "Go",
  ".rb": "Ruby",
  ".php": "PHP",
  ".rs": "Rust",
  ".kt": "Kotlin", ".kts": "Kotlin",
  ".swift": "Swift",
  // ignore / neutros
  ".md": null, ".json": null, ".yml": null, ".yaml": null, ".lock": null
};

const IGNORE_DIRS = new Set([
  "node_modules", ".git", ".github", "venv", ".venv",
  "__pycache__", "dist", "build", "out", ".next", ".cache",
  ".vscode", "coverage", "assets", "scripts" // <- não contam para skills
]);

import fs from "fs";
import path from "path";

function computeLanguagesFromDir(rootAbs) {
  const totals = new Map(); // lang -> bytes

  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      let stat;
      try { stat = fs.statSync(full); } catch { continue; }
      if (stat.isDirectory()) {
        if (!IGNORE_DIRS.has(name)) walk(full);
        continue;
      }
      const ext = path.extname(name).toLowerCase();
      const lang = EXT_MAP[ext];
      if (!lang) continue; // ignora extensões não mapeadas
      const size = stat.size || 0;
      totals.set(lang, (totals.get(lang) || 0) + size);
    }
  }

  walk(rootAbs);

  const sum = Array.from(totals.values()).reduce((a,b)=>a+b,0);
  if (!sum) return {};

  const result = Object.fromEntries(
    Array.from(totals.entries())
      .map(([lang, bytes]) => [lang, +(bytes*100/sum).toFixed(1)])
      .sort((a,b) => b[1] - a[1])
  );
  return result;
}

function extToLang(ext){
  switch(ext){
    case 'js': case 'mjs': return 'JS';
    case 'ts': case 'tsx': return 'JS';
    case 'py': case 'ipynb': return 'Python';
    case 'html': case 'css': return 'HTML/CSS';
    case 'sql': case 'psql': case 'pgsql': return 'SQL';
    case 'java': return 'Java';
    case 'pbix': case 'pbit': return 'PowerBI';
    case 'm': return 'PowerBI'; // Power Query M
    default: return null;
  }
}

async function walk(dir){
  const out = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for(const it of items){
    const p = path.join(dir, it.name);
    const rel = path.relative(ROOT, p).replaceAll('\\','/');
    if(EXCLUDE.test(rel)) continue;
    if(it.isDirectory()){
      out.push(...await walk(p));
    }else{
      out.push(rel);
    }
  }
  return out;
}

function parseReadme(md){
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : null;

  const blocks = md.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  let description = null;
  for(const b of blocks){
    if(/^#/.test(b)) continue;
    if(/^!\[.*?\]\(.*?\)/.test(b)) continue;
    if(/^(image|capa)\s*:/i.test(b)) continue;
    description = b.replace(/\n/g,' ');
    if(description.length>0) break;
  }

  const m1 = md.match(/^(?:image|capa)\s*:\s*(\S+)/im);
  const m2 = md.match(/!\[.*?\]\((.*?)\)/);
  const imageUrl = m1?.[1] || m2?.[1] || null;

  const p1 = md.match(/^(?:progress|feito|conclusao|conclusão)\s*:\s*(\d{1,3})%/im);
  let progress = p1 ? Math.min(100, parseInt(p1[1],10)) : null;
  if(progress == null){
    const loose = md.match(/(\d{1,3})\s*%/);
    progress = loose ? Math.min(100, parseInt(loose[1],10)) : null;
  }
  return { title, description, imageUrl, progress };
}

function inferTags(projectDir, allFiles){
  const prefix = `${projectDir}/`;
  const files = allFiles.filter(p => p.startsWith(prefix));
  const tagSet = new Set();
  for(const f of files){
    const m = f.match(/\.([a-z0-9]+)$/i);
    if(!m) continue;
    const tag = extToLang(m[1].toLowerCase());
    if(tag) tagSet.add(tag);
  }
  if(files.some(p => /(^|\/)package\.json$/i.test(p))) tagSet.add('NodeJS');
  const tags = [...tagSet].filter(t => INTEREST_TAGS.has(t));
  return tags.length ? tags : ['HTML/CSS'];
}

async function main(){
  // lista todos os arquivos do repo (uma vez)
  const allFiles = await walk(ROOT);

  // encontre diretórios dentro de Projetos que contenham README.md na raiz
  const readmes = allFiles.filter(p => p.startsWith('Projetos/') && /\/README(?:\.md)?$/i.test(p));
  const seen = new Set();
  const projects = [];
  for(const readmePath of readmes){
    const dir = readmePath.replace(/\/README(?:\.md)?$/i,'');
    if(seen.has(dir)) continue;
    seen.add(dir);

    const md = await fs.readFile(path.join(ROOT, readmePath),'utf8').catch(()=>null);
    const meta = md ? parseReadme(md) : {};
    const tags = inferTags(dir, allFiles);

    projects.push({
      dir,                 // ex.: "Projetos/Alura/7DaysOfCode/JS/..."
      readmePath,          // ex.: "Projetos/.../README.md"
      meta: {
        title: meta.title || dir.split('/').pop(),
        description: meta.description || '',
        imageUrl: meta.imageUrl || '',
        progress: typeof meta.progress==='number' ? meta.progress : null
      },
      tags
    });
  }

  // ordene se quiser (por nome)
  projects.sort((a,b)=>a.dir.localeCompare(b.dir,'pt-BR'));

  // salva na raiz
  await fs.writeFile(path.join(ROOT,'projects.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), projects }, null, 2),
    'utf8'
  );
  console.log(`Gerados ${projects.length} projetos em projects.json`);
}

// ===== My skills dinâmico a partir do repoLanguages =====
(async function renderSkillsFromRepoLanguages() {
  const skillsList = document.querySelector('.resume .skills-list');
  if (!skillsList) return;

  try {
    const res = await fetch('./projects.json?v=' + Date.now(), { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const langs = data.repoLanguages || {};
    const entries = Object.entries(langs);
    if (!entries.length) return;

    // Limita a 8 linguagens para não poluir
    const top = entries.slice(0, 8);

    const html = top.map(([name, pct]) => `
      <li class="skills-item">
        <div class="title-wrapper">
          <h5 class="h5">${name}</h5>
          <data value="${pct}">${pct}%</data>
        </div>
        <div class="skill-progress-bg">
          <div class="skill-progress-fill" style="width:${Math.max(3, pct)}%;"></div>
        </div>
      </li>
    `).join('');

    skillsList.innerHTML = html;
  } catch (e) {
    console.warn('[skills] falha ao carregar repoLanguages:', e);
    // opcional: manter estático se der erro
  }
})();

main().catch(err=>{ console.error(err); process.exit(1); });
