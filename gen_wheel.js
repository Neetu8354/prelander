const fs = require("fs");
const CX = 300, CY = 300;
const R_IN = 68, R_OUT = 272, HALF = 15; // segment half-angle in degrees
const rad = d => (d * Math.PI) / 180;
const P = (r, a) => [(CX + r * Math.cos(rad(a))).toFixed(1), (CY + r * Math.sin(rad(a))).toFixed(1)];

// label, color key, font size
const segs = [
  [2,   "100% MATCH",    "goldMid", 26],
  [32,  "15 SPINS",      "bronze",  30],
  [62,  "NO LUCK TODAY", "black",   20],
  [92,  "125 SPINS",     "gold",    30],
  [122, "100% MATCH",    "goldMid", 26],
  [152, "15 SPINS",      "bronze",  30],
  [182, "NO LUCK TODAY", "black",   20],
  [212, "125 SPINS",     "gold",    30],
  [242, "100% MATCH",    "goldMid", 26],
  [272, "15 SPINS",      "bronze",  30],
  [302, "NO LUCK TODAY", "black",   20],
  [332, "125 SPINS",     "gold",    30],
];

const wedgePath = () => {
  const [ox1, oy1] = P(R_OUT, -HALF), [ox2, oy2] = P(R_OUT, HALF);
  const [ix1, iy1] = P(R_IN, -HALF), [ix2, iy2] = P(R_IN, HALF);
  return `M ${ix1} ${iy1} L ${ox1} ${oy1} A ${R_OUT} ${R_OUT} 0 0 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${R_IN} ${R_IN} 0 0 0 ${ix1} ${iy1} Z`;
};

let body = "";
for (const [ang, label, color, fs] of segs) {
  body += `    <g transform="rotate(${ang} ${CX} ${CY})">
      <path d="${wedgePath()}" fill="url(#g_${color})" stroke="#000" stroke-opacity="0.45" stroke-width="1"/>
      <text x="470" y="${CY}" text-anchor="middle" dominant-baseline="middle"
            font-family="Arial, 'Helvetica Neue', sans-serif" font-weight="900" font-size="${fs}"
            fill="#fff" stroke="rgba(0,0,0,0.65)" stroke-width="1.2" paint-order="stroke"
            textLength="150" lengthAdjust="spacingAndGlyphs">${label}</text>
    </g>\n`;
}

// pegs at segment boundaries
for (let i = 0; i < 12; i++) {
  const a = 17 + i * 30;
  const [x, y] = P(286, a);
  body += `    <circle cx="${x}" cy="${y}" r="7" fill="url(#pegGrad)" stroke="#5c4500" stroke-width="1"/>\n`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
  <defs>
    <linearGradient id="g_gold" x1="68" y1="0" x2="272" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#c98f00"/><stop offset="0.45" stop-color="#ffd700"/><stop offset="1" stop-color="#f7c412"/>
    </linearGradient>
    <linearGradient id="g_goldMid" x1="68" y1="0" x2="272" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#8a6a00"/><stop offset="0.5" stop-color="#e8c25a"/><stop offset="1" stop-color="#c9940a"/>
    </linearGradient>
    <linearGradient id="g_bronze" x1="68" y1="0" x2="272" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#5c3d00"/><stop offset="0.5" stop-color="#b8860b"/><stop offset="1" stop-color="#8a5a00"/>
    </linearGradient>
    <linearGradient id="g_black" x1="68" y1="0" x2="272" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#000000"/><stop offset="0.5" stop-color="#2b2b2b"/><stop offset="1" stop-color="#0d0d0d"/>
    </linearGradient>
    <linearGradient id="rimGrad" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#ffe680"/><stop offset="0.5" stop-color="#f7c412"/><stop offset="1" stop-color="#9a6a00"/>
    </linearGradient>
    <radialGradient id="pegGrad" cx="0.35" cy="0.3" r="0.9">
      <stop offset="0" stop-color="#fff6c9"/><stop offset="0.55" stop-color="#ffd700"/><stop offset="1" stop-color="#7a5c00"/>
    </radialGradient>
    <radialGradient id="hubGrad" cx="0.4" cy="0.35" r="1">
      <stop offset="0" stop-color="#3a3a3a"/><stop offset="1" stop-color="#000000"/>
    </radialGradient>
    <radialGradient id="sheen" cx="0.42" cy="0.38" r="0.75">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/><stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <circle cx="${CX}" cy="${CY}" r="280" fill="none" stroke="url(#rimGrad)" stroke-width="17"/>
  <circle cx="${CX}" cy="${CY}" r="289" fill="none" stroke="#4a3500" stroke-width="1.5"/>
  <circle cx="${CX}" cy="${CY}" r="271" fill="none" stroke="#4a3500" stroke-width="1.5"/>
${body}  <circle cx="${CX}" cy="${CY}" r="272" fill="url(#sheen)" pointer-events="none"/>
  <circle cx="${CX}" cy="${CY}" r="66" fill="url(#hubGrad)" stroke="url(#rimGrad)" stroke-width="5"/>
  <circle cx="${CX}" cy="${CY}" r="58" fill="none" stroke="#f7c412" stroke-opacity="0.5" stroke-width="1.5"/>
</svg>`;

fs.writeFileSync("wheel.svg", svg);
console.log("svg bytes:", svg.length);
const b64 = Buffer.from(svg).toString("base64");
console.log("b64 bytes:", b64.length);

let h = fs.readFileSync("cashout9.html", "utf8");
const before = h.length;
h = h.replace(
  /class="wheel__image" src="data:image\/[a-zA-Z+]+;base64,[^"]+"/,
  `class="wheel__image" src="data:image/svg+xml;base64,${b64}"`
);
fs.writeFileSync("cashout9.html", h);
console.log("html:", before, "->", h.length);
