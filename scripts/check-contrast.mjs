// WCAG AA checks for readable text pairs and accent labels used by the visual system.
const pairs = [
  ["texto secundário claro / superfície", "#596579", "#ffffff", 4.5],
  ["texto secundário claro / fundo suave", "#596579", "#f0eee8", 4.5],
  ["texto secundário claro / fundo geral", "#596579", "#f6f4ef", 4.5],
  ["texto principal claro", "#222b3a", "#ffffff", 4.5],
  ["botão claro", "#ffffff", "#087e75", 4.5],
  ["coral claro", "#b64b45", "#ffffff", 4.5],
  ["açafrão claro", "#805400", "#ffffff", 4.5],
  ["violeta claro", "#7053b8", "#ffffff", 4.5],
  ["azul claro", "#315f99", "#ffffff", 4.5],
  ["aviso claro", "#805000", "#fff0d3", 4.5],
  ["texto secundário escuro / superfície", "#b8c4d4", "#1c2633", 4.5],
  ["texto secundário escuro / fundo suave", "#b8c4d4", "#253548", 4.5],
  ["texto principal escuro", "#f1f4f8", "#1c2633", 4.5],
  ["botão escuro", "#122722", "#73dfcf", 4.5],
  ["coral escuro", "#ff9488", "#1c2633", 4.5],
  ["açafrão escuro", "#f3c66b", "#1c2633", 4.5],
  ["violeta escuro", "#b9a4ff", "#1c2633", 4.5],
  ["azul escuro", "#91bdff", "#1c2633", 4.5],
  ["aviso escuro", "#ffdb9b", "#44341f", 4.5]
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
