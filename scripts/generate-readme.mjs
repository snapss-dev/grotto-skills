import { readFileSync, writeFileSync } from "node:fs";

import {
  loadJson,
  manifestPath,
  readmePath,
  withGeneratedCatalog
} from "./skill-catalog.mjs";

const readme = readFileSync(readmePath, "utf8");
const manifest = loadJson(manifestPath);
writeFileSync(readmePath, withGeneratedCatalog(readme, manifest));
console.log(`Generated README catalog for ${manifest.skills.length} skills.`);
