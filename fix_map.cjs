const fs = require('fs');
let code = fs.readFileSync('src/components/ThreeDMap.tsx', 'utf-8');

code = code.replace(
  "              {/* Clusters and Venues */}",
  "</Map>\n              {/* Clusters and Venues */}"
);

// Wait, if it replaced everything up to `{/* Custom`, the `</Map>` needs to be at the end.
// Let's check where the replacement was placed.
// Actually, let's just append `</Map>` right before `{/* Custom high-contrast`
code = code.replace(
  "{/* Custom high-contrast Location Detail Card overlay */}",
  "</Map>\n            {/* Custom high-contrast Location Detail Card overlay */}"
);

fs.writeFileSync('src/components/ThreeDMap.tsx', code);
console.log('Fixed Map closing tag');
