import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// --- Configuration ---
const DOCS_PATH = "docs/";
const OUTPUT_FILE = path.join("src", "data", "doc-versions.json");
const REPO_URL_BASE = "https://github.com/gwenphalan/borg-ui";

// --- Helper Functions ---

/**
 * Executes a Git command and returns the trimmed output.
 * @param {string} command The Git command to execute.
 * @returns {string} The stdout of the command.
 */
function git(command) {
  try {
    return execSync(`git ${command}`, { encoding: "utf-8" }).trim();
  } catch (error) {
    console.error(`Error executing git command: git ${command}`);
    console.error(error.stderr || error.message);
    process.exit(1);
  }
}

function docsExistAtTag(tag) {
  try {
    execSync(`git ls-tree -d ${tag} -- ${DOCS_PATH}`);
    return true;
  } catch {
    return false;
  }
}

function getMajorMinor(version) {
  const match = version.match(/v?(\d+)\.(\d+)/);
  return match ? `${match[1]}.${match[2]}` : null;
}

// --- Main Script ---

function main() {
  console.log("Generating documentation version manifest...");

  const tags = git("tag --sort=-v:refname").split("\n").filter(Boolean);
  if (tags.length === 0) {
    fs.writeFileSync(OUTPUT_FILE, "[]", "utf-8");
    return;
  }

  const seen = new Set();
  const manifest = [];

  for (const tag of tags) {
    const versionMatch = tag.match(/^v?(\d+)\.(\d+)\.(\d+)$/);
    if (!versionMatch) continue;
    const [_, major, minor, patch] = versionMatch;
    if (patch !== "0") continue; // Only include x.y.0 (major/minor)
    const majorMinor = `${major}.${minor}`;
    if (seen.has(majorMinor)) continue; // Only latest for each major.minor
    seen.add(majorMinor);
    const hasDocs = docsExistAtTag(tag);
    manifest.push({
      version: `${major}.${minor}.0`,
      hasDocs,
      compareUrl: hasDocs ? `${REPO_URL_BASE}/tree/${tag}/docs` : null,
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Successfully generated version manifest at ${OUTPUT_FILE}`);
}

main();
