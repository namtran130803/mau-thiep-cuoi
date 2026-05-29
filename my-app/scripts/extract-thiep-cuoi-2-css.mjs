import fs from "fs";

const html = fs.readFileSync("c:/Code/mau-thiep-cuoi/thiep_cuoi_2.html", "utf8");
const lines = html.split(/\r?\n/);
const start = lines.findIndex((l) => l.trim() === "<style>") + 1;
const end = lines.findIndex((l) => l.trim() === "</style>");
let css = lines.slice(start, end).join("\n");

css =
  '@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Cormorant+Garamond:wght@500;600;700&family=Great+Vibes&family=Libre+Baskerville:wght@400;700&display=block");\n\n' +
  css;

css = css.replace(/^      :root \{/m, "      .thiep-cuoi-2 {");
css = css.replace(/^      \* \{/m, "      .thiep-cuoi-2 * {");
css = css.replace(/^      html \{/m, "      .thiep-cuoi-2 {");
css = css.replace(/^      html::-webkit-scrollbar/m, "      .thiep-cuoi-2::-webkit-scrollbar");
css = css.replace(
  /^      html:not\(\.fonts-ready\) body \{/m,
  "      .thiep-cuoi-2:not(.fonts-ready) {",
);
css = css.replace(/^      html\.fonts-ready body \{/m, "      .thiep-cuoi-2.fonts-ready {");
css = css.replace(/^      body \{/m, "      .thiep-cuoi-2 {");
css = css.replace(/^      body\.cover-locked/m, "      .thiep-cuoi-2.cover-locked");
css = css.replace(/^      body::-webkit-scrollbar/m, "      .thiep-cuoi-2::-webkit-scrollbar");
css = css.replace(/^      img \{/m, "      .thiep-cuoi-2 img {");
css = css.replace(
  /^      button,\s*\n        input,\s*\n        select,\s*\n        textarea \{/m,
  "      .thiep-cuoi-2 button,\n        .thiep-cuoi-2 input,\n        .thiep-cuoi-2 select,\n        .thiep-cuoi-2 textarea {",
);
css = css.replace(/^      button \{/m, "      .thiep-cuoi-2 button {");
css = css.replace(/^      a \{/m, "      .thiep-cuoi-2 a {");

css = css
  .split("\n")
  .map((line) => {
    if (/^\s*@/.test(line)) return line;
    const m = line.match(/^(\s+)\.(.+?)\s*\{\s*$/);
    if (!m) return line;
    const sel = m[2].trim();
    if (sel.startsWith("thiep-cuoi-2")) return line;
    return `${m[1]}.thiep-cuoi-2 .${sel} {`;
  })
  .join("\n");

if (!css.includes("min-height: 100dvh")) {
  css = css.replace(
    /(      \.thiep-cuoi-2 \{\n        min-height: 100vh;)/,
    "      .thiep-cuoi-2 {\n        position: relative;\n        isolation: isolate;\n        width: 100%;\n        min-height: 100dvh;",
  );
}

fs.mkdirSync("c:/Code/mau-thiep-cuoi/my-app/templates/thiep-cuoi-2", { recursive: true });
fs.writeFileSync("c:/Code/mau-thiep-cuoi/my-app/templates/thiep-cuoi-2/styles.css", css);
console.log("done", css.length);
