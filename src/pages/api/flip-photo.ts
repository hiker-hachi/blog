export const prerender = false;

import type { APIRoute } from 'astro';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const MDX_FILE = resolve(process.cwd(), 'src/content/blog/yakushima-jomon-sugi.mdx');

function flipSectionChildren(content: string, imageVar: string): string {
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() !== '<div class="side-by-side">') continue;

    let containsImage = false;
    let blockEnd = -1;
    let depth = 1;

    for (let j = i + 1; j < lines.length; j++) {
      const t = lines[j].trim();
      if (t.startsWith('<div')) depth++;
      if (t === '</div>') {
        depth--;
        if (depth === 0) { blockEnd = j; break; }
      }
      if (lines[j].includes(`src={${imageVar}}`)) containsImage = true;
    }

    if (!containsImage || blockEnd === -1) continue;

    // Collect inner lines (non-empty only)
    const inner = lines.slice(i + 1, blockEnd).filter(l => l.trim());

    // Parse child1 (first element) and child2 (everything else)
    const child1: string[] = [];
    const child2: string[] = [];
    let inChild2 = false;
    let c1Depth = 0;

    for (const line of inner) {
      const t = line.trim();
      if (!inChild2) {
        child1.push(line);
        if (t.startsWith('<div')) c1Depth++;
        if (t === '</div>') c1Depth--;
        if (c1Depth === 0 && (t.endsWith('/>') || t.endsWith('</p>') || t.endsWith('</div>'))) {
          inChild2 = true;
        }
      } else {
        child2.push(line);
      }
    }

    if (child1.length === 0 || child2.length === 0) continue;

    const newLines = [
      ...lines.slice(0, i),
      lines[i],
      '',
      ...child2,
      ...child1,
      '',
      lines[blockEnd],
      ...lines.slice(blockEnd + 1),
    ];

    return newLines.join('\n');
  }

  return content;
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const data = await request.formData();
  const section = data.get('section') as string;
  if (!section) return redirect('/admin?error=1');

  const content = readFileSync(MDX_FILE, 'utf-8');
  const updated = flipSectionChildren(content, section);
  writeFileSync(MDX_FILE, updated);

  return redirect('/admin?updated=1');
};
