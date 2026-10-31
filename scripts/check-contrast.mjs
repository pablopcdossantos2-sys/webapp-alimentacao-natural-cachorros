const pairs = [
  ["texto secundário / fundo claro", "#56665b", "#f5f7ef", 4.5],
  ["texto secundário / cartão claro", "#56665b", "#e8f1e6", 4.5],
  ["texto do botão claro", "#ffffff", "#286b48", 4.5],
  ["texto do botão escuro", "#0f1f16", "#8fd2a5", 4.5],
  ["texto secundário / cartão escuro", "#b2c2b4", "#263b2d", 4.5],
  ["aviso claro", "#7b4c00", "#fff1d7", 4.5],
  ["aviso escuro", "#ffd78a", "#3e301a", 4.5]
];
function luminance(hex) {
  const rgb = hex.match(/[a-f\d]{2}/gi).map(v => parseInt(v,16)/255);
  const linear = rgb.map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return .2126*linear[0] + .7152*linear[1] + .0722*linear[2];
}
let failed = false;
for (const [name,fg,bg,min] of pairs) {
  const values = [luminance(fg),luminance(bg)].sort((a,b)=>b-a);
  const ratio = (values[0]+.05)/(values[1]+.05);
  console.log(`${ratio >= min ? "OK" : "FALHA"} ${name}: ${ratio.toFixed(2)}:1 (mínimo ${min}:1)`);
  if (ratio < min) failed = true;
}
if (failed) process.exitCode = 1;
