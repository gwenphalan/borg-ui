import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { buildNavStructure } from "./generate-nav.mjs";

// --- Configuration ---
const DOCS_PATH = "docs";
const OUTPUT_FILE = path.join("src", "data", "doc-versions.json");
const REPO_URL_BASE = "https://github.com/gwenphalan/borg-ui";
const ARCHIVE_ROOT = path.join("public", "documentation");

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
    // Use ls-tree to check for the directory's existence in the tag
    execSync(`git ls-tree -d ${tag} -- ${DOCS_PATH}`, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

async function generateNavManifestForTag(tag) {
  const tempDocsPath = "docs_temp_build";
  const versionArchivePath = path.join(ARCHIVE_ROOT, tag);
  await fs.promises.mkdir(versionArchivePath, { recursive: true });

  const docsDirExists = fs.existsSync(DOCS_PATH);

  try {
    if (docsDirExists) {
      await fs.promises.rename(DOCS_PATH, tempDocsPath);
    }

    // Use git restore to bring the docs from the specific tag into the worktree
    execSync(`git restore --source=${tag} --worktree --staged ${DOCS_PATH}`);

    // Generate the nav manifest using the logic from our other script
    const navManifest = await buildNavStructure(DOCS_PATH);

    await fs.promises.cp(DOCS_PATH, versionArchivePath, { recursive: true });

    return navManifest;
  } catch (error) {
    console.error(`Failed to generate nav manifest for tag ${tag}:`, error);
    return null; // Return null on failure to allow script to continue
  } finally {
    // Cleanup: remove the checked-out docs directory
    await fs.promises.rm(DOCS_PATH, { recursive: true, force: true });

    // Restore the original docs directory if it was moved
    if (docsDirExists) {
      await fs.promises.rename(tempDocsPath, DOCS_PATH);
    }
  }
}

// --- Main Script ---

async function main() {
  console.log("Generating documentation version manifest...");

  if (fs.existsSync(ARCHIVE_ROOT)) {
    console.log("Cleaning old documentation archive...");
    await fs.promises.rm(ARCHIVE_ROOT, { recursive: true, force: true });
  }

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
    const majorMinor = `${major}.${minor}`;
    if (seen.has(majorMinor)) continue;
    seen.add(majorMinor);

    console.log(`Processing tag: ${tag}`);
    const hasDocs = docsExistAtTag(tag);
    const navManifest = hasDocs ? await generateNavManifestForTag(tag) : null;

    manifest.push({
      version: `${major}.${minor}.${patch}`,
      hasDocs,
      compareUrl: hasDocs ? `${REPO_URL_BASE}/tree/${tag}/docs` : null,
      navManifest,
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`Successfully generated version manifest at ${OUTPUT_FILE}`);
}

main();
