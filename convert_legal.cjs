const fs = require('fs');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Backgrounds and overlays
  content = content.replace(/bg-black\/95/g, 'bg-brand-light-100');
  content = content.replace(/bg-zinc-950/g, 'bg-brand-light-200 border-2 border-brand-dark-900 shadow-[4px_4px_0px_var(--color-ink)]');
  content = content.replace(/bg-zinc-900(?!\/)/g, 'bg-brand-light-300');
  content = content.replace(/bg-zinc-900\/45/g, 'bg-brand-light-300');
  content = content.replace(/bg-zinc-900\/40/g, 'bg-brand-light-300');
  
  // Borders
  content = content.replace(/border-zinc-900\/80/g, 'border-brand-dark-900');
  content = content.replace(/border-zinc-900\/60/g, 'border-brand-dark-900');
  content = content.replace(/border-zinc-850\/80/g, 'border-brand-dark-900');
  content = content.replace(/border-zinc-900/g, 'border-brand-dark-900');
  content = content.replace(/border-zinc-800/g, 'border-brand-dark-900');
  
  // Colors
  content = content.replace(/text-white/g, 'text-brand-dark-900');
  content = content.replace(/text-zinc-200/g, 'text-brand-dark-900');
  content = content.replace(/text-zinc-300/g, 'text-brand-dark-900');
  content = content.replace(/text-zinc-400/g, 'text-brand-dark-800');
  content = content.replace(/text-zinc-500/g, 'text-brand-dark-700');
  content = content.replace(/text-zinc-650/g, 'text-brand-dark-600');
  content = content.replace(/text-zinc-600/g, 'text-brand-dark-600');
  
  // Accents
  content = content.replace(/text-amber-500/g, 'text-brand-primary-500');
  content = content.replace(/text-amber-400/g, 'text-brand-primary-500');
  content = content.replace(/bg-amber-500/g, 'bg-brand-primary-500');
  content = content.replace(/border-amber-500/g, 'border-brand-primary-500');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Processed', filePath);
}

processFile('/Users/ciarannash/Downloads/Atzengold/atzengold-web-main/src/components/Impressum.tsx');
processFile('/Users/ciarannash/Downloads/Atzengold/atzengold-web-main/src/components/Datenschutz.tsx');
