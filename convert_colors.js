const { converter } = require('culori');

const colors = {
  primary: '#921a22',
  primaryDeep: '#7f151b',
  primaryPress: '#5e0b10',
  primarySoft: '#a62029',
  brandDark900: '#09090b',
  ink: '#1c1917',
  inkSecondary: '#44403c',
  inkMute: '#78716c',
  inkMute2: '#a8a29e',
  canvas: '#FAF8F2',
  canvasSoft: '#FCFBF7',
  ruby: '#f59e0b',
  magenta: '#fbbf24',
  lemon: '#fcd34d',
  scrollbarThumb: '#27272a',
};

const toOklch = converter('oklch');

console.log('--- OKLCH Values ---');
for (const [name, hex] of Object.entries(colors)) {
  const oklchObj = toOklch(hex);
  if (!oklchObj) {
    console.log(`${name}: Failed to convert ${hex}`);
    continue;
  }
  
  // Format to standard oklch(L C H)
  const l = Math.round(oklchObj.l * 1000) / 1000;
  const c = Math.round(oklchObj.c * 1000) / 1000;
  const h = Math.round((oklchObj.h || 0) * 10) / 10;
  
  console.log(`${name}: oklch(${l} ${c} ${h})  /* ${hex} */`);
}
