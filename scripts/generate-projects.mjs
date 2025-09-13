import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PROJECTS_DIR = path.join(ROOT, 'Projetos');

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);
const EXCLUDE = new RegExp('(^|/)(node_modules|\\.venv|venv|__pycache__|dist|build|coverage|\\.next|\\.nuxt|\\.cache|vendor|deps|third[-_]?party|site-packages|dist-packages|packages|\\.husky|\\.git)(/|$)','i');

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

main().catch(err=>{ console.error(err); process.exit(1); });
