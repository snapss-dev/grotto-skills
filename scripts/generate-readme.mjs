import { readFileSync, writeFileSync } from "node:fs";
import { buildManifest, manifestPath, readmePath, withGeneratedCatalog } from "./skill-catalog.mjs";

const manifest = buildManifest();
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
writeFileSync(readmePath, withGeneratedCatalog(readFileSync(readmePath, "utf8"), manifest));
console.log("Generated catalog: " + manifest.skills.length + " skills, revision " + manifest.revision);
