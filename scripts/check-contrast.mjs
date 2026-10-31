// WCAG AA checks for text/background pairs currently used by the UI.
const pairs = [
  ["texto muted claro / soft claro", "#56665b", "#e8f1e6", 4.5],
  ["texto muted claro / fundo claro", "#56665b", "#f5f7ef", 4.5],
  ["botão claro", "#ffffff", "#286b48", 4.5],
  ["botão escuro", "#0f1f16", "#8fd2a5", 4.5],
  ["aviso claro", "#7b4c00", "#fff1d7", 4.5],
  ["aviso escuro", "#ffd78a", "#3e301a", 4.5],
  ["texto muted escuro / soft escuro", "#b2c2b4", "#263b2d", 4.5],
  ["texto muted escuro / fundo escuro", "#b2c2b4", "#111a15", 4.5],
  ["texto principal claro", "#1d3026", "#ffffff", 4.5],
  ["texto principal escuro", "#eef6ed", "#1a261f", 4.5]
];

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map(value => parseInt(value, 16) / 255);
  const linear = channels.map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}
function contrast(a, b) {
  const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
let failed = false;
for (const [label, foreground, background, minimum] of pairs) {
  const value = contrast(foreground, background);
  const passed = value >= minimum;
  console.log(`${passed ? "OK" : "FALHA"} ${label}: ${value.toFixed(2)}:1 (mínimo ${minimum}:1)`);
  if (!passed) failed = true;
}
if (failed) process.exitCode = 1;
