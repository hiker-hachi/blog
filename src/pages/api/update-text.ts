export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const MDX_FILE = resolve(process.cwd(), 'src/content/blog/yakushima-jomon-sugi.mdx');

function setPInSideBySide(content: string, imageVar: string, newText: string): string {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '<div class="side-by-side">') continue;
    let containsImage = false, blockEnd = -1, depth = 1;
    for (let j = i + 1; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t.startsWith('<div')) depth++;
      if (t === '</div>') { depth--; if (!depth) { blockEnd = j; break; } }
      if (lines[j].includes(`src={${imageVar}}`)) containsImage = true;
    }
    if (!containsImage || blockEnd === -1) continue;
    for (let j = i + 1; j < blockEnd; j++) {
      const t = lines[j].trim();
      if (t.startsWith('<p>') && t.endsWith('</p>')) {
        const indent = lines[j].match(/^(\s*)/)?.[1] ?? '  ';
        lines[j] = `${indent}<p>${newText}</p>`;
        return lines.join('\n');
      }
    }
  }
  return content;
}

function setDivParagraphs(content: string, imageVar: string, newText: string): string {
  const lines = content.split('\n');
  const paragraphs = newText.split('\n\n').map(p => p.trim()).filter(p => p);
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '<div class="side-by-side">') continue;
    let containsImage = false, blockEnd = -1, depth = 1;
    for (let j = i + 1; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t.startsWith('<div')) depth++;
      if (t === '</div>') { depth--; if (!depth) { blockEnd = j; break; } }
      if (lines[j].includes(`src={${imageVar}}`)) containsImage = true;
    }
    if (!containsImage || blockEnd === -1) continue;
    for (let j = i + 1; j < blockEnd; j++) {
      if (!lines[j].trim().startsWith('<div')) continue;
      let innerEnd = -1, d = 1;
      for (let k = j + 1; k < blockEnd; k++) {
        const t = lines[k].trim();
        if (t.startsWith('<div')) d++;
        if (t === '</div>') { d--; if (!d) { innerEnd = k; break; } }
      }
      if (innerEnd === -1) continue;
      const innerIndent = '    ';
      const headings: string[] = [];
      for (let k = j + 1; k < innerEnd; k++) {
        if (/^\s*<h[1-6]/.test(lines[k])) headings.push(lines[k]);
      }
      const newInner = [...headings, ...paragraphs.map(p => `${innerIndent}<p>${p}</p>`)];
      return [...lines.slice(0, j + 1), ...newInner, ...lines.slice(innerEnd)].join('\n');
    }
  }
  return content;
}

function setKneeText(content: string, newText: string): string {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].includes('text-with-photos')) continue;
    for (let j = i + 1; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t === '</div>') break;
      if (t.startsWith('<p>') && t.endsWith('</p>')) {
        const indent = lines[j].match(/^(\s*)/)?.[1] ?? '  ';
        lines[j] = `${indent}<p>${newText}</p>`;
        return lines.join('\n');
      }
    }
  }
  return content;
}

function setIntroText(content: string, newText: string): string {
  const lines = content.split('\n');
  let lastImport = -1, firstDiv = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImport = i;
    if (lastImport > -1 && firstDiv === -1 && lines[i].trim().startsWith('##')) { firstDiv = i; break; }
  }
  if (lastImport === -1 || firstDiv === -1) return content;
  return [...lines.slice(0, lastImport + 1), '', newText, '', ...lines.slice(firstDiv)].join('\n');
}

function setFooterText(content: string, newText: string): string {
  const lines = content.split('\n');
  for (let i = lines.length - 1; i >= 0; i--) {
    const t = lines[i].trim();
    if (t && !t.startsWith('<') && !t.startsWith('---') && !t.startsWith('import')) {
      lines[i] = newText;
      return lines.join('\n');
    }
  }
  return content;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData();
  const blockId = data.get('blockId') as string;
  const text = data.get('text') as string;
  if (!blockId || text === null) return redirect('/admin?error=1');

  let content = readFileSync(MDX_FILE, 'utf-8');

  if (blockId === 'intro') content = setIntroText(content, text);
  else if (blockId === 'tunnel') content = setPInSideBySide(content, 'tunnel', text);
  else if (blockId === 'wilson') content = setPInSideBySide(content, 'wilson2', text);
  else if (blockId === 'jomon') content = setPInSideBySide(content, 'jomonSugi', text);
  else if (blockId === 'knee') content = setKneeText(content, text);
  else if (blockId === 'nameless') content = setDivParagraphs(content, 'namelessSugi', text);
  else if (blockId === 'doobop') content = setDivParagraphs(content, 'doobop', text);
  else if (blockId === 'footer') content = setFooterText(content, text);

  writeFileSync(MDX_FILE, content);
  return redirect('/admin?updated=1&tab=text');
};
