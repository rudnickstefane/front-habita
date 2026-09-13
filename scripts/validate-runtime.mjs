import { execFileSync } from "node:child_process";

const REQUIRED_NODE_MAJOR = 24;
const REQUIRED_PNPM_MAJOR = 12;

function major(version) {
  return Number(version.replace(/^v/, "").split(".")[0]);
}

function fail(message) {
  console.error(`\n[preflight] ${message}\n`);
  process.exit(1);
}

if (major(process.version) !== REQUIRED_NODE_MAJOR) {
  fail(
    `Node.js ${REQUIRED_NODE_MAJOR} LTS é obrigatório. Versão atual: ${process.version}.`,
  );
}

let pnpmVersion;
try {
  pnpmVersion = execFileSync("pnpm", ["--version"], {
    encoding: "utf8",
  }).trim();
} catch {
  fail("pnpm não foi encontrado. Ative o Corepack ou instale o pnpm 12.");
}

if (major(pnpmVersion) !== REQUIRED_PNPM_MAJOR) {
  fail(`pnpm ${REQUIRED_PNPM_MAJOR} é obrigatório. Versão atual: ${pnpmVersion}.`);
}

console.log(
  `[preflight] Runtime válido: Node ${process.version} / pnpm ${pnpmVersion}.`,
);
