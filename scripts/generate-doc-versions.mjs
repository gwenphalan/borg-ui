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

/**
 * Checks if there are differences in the docs directory between two refs.
 * @param {string} ref1 The first ref (e.g., a tag).
 * @param {string} ref2 The second ref (e.g., a tag).
 * @returns {boolean} True if there are differences, false otherwise.
 */
function haveDocsChanged(ref1, ref2) {
  try {
    // --quiet exits with 1 if there are differences, 0 otherwise.
    execSync(`git diff --quiet ${ref1} ${ref2} -- ${DOCS_PATH}`);
    return false; // Exit code 0, no differences
  } catch (error) {
    if (error.status === 1) {
      return true; // Exit code 1, differences found
    }
    // For other errors, log and exit
    console.error(`Error comparing docs between ${ref1} and ${ref2}:`);
    console.error(error.stderr || error.message);
    process.exit(1);
  }
}

// --- Main Script ---

function main() {
  console.log("Generating documentation version manifest...");

  // 1. Get all tags, sorted by version number (descending)
  const tags = git("tag --sort=-v:refname").split("\n").filter(Boolean);
  if (tags.length === 0) {
    console.log("No tags found. Skipping version manifest generation.");
    fs.writeFileSync(OUTPUT_FILE, "[]", "utf-8");
    return;
  }

  const versionManifest = [];
  let lastTagWithDocs = "HEAD"; // Start by comparing the latest tag to HEAD

  // 2. Iterate through tags to find which ones have unique docs
  for (let i = 0; i < tags.length; i++) {
    const currentTag = tags[i];
    let hasUniqueDocs = false;

    if (i === 0) {
      // The very first (latest) tag is compared against HEAD
      hasUniqueDocs = haveDocsChanged(lastTagWithDocs, currentTag);
    } else {
      // Subsequent tags are compared against the last tag that had unique docs
      hasUniqueDocs = haveDocsChanged(lastTagWithDocs, currentTag);
    }

    if (hasUniqueDocs) {
      versionManifest.push({
        version: currentTag,
        hasDocs: true,
        // The compare URL shows changes in the docs dir since the last version with docs
        compareUrl: `${REPO_URL_BASE}/compare/${lastTagWithDocs}...${currentTag}#files_bucket`,
      });
      lastTagWithDocs = currentTag; // Update the baseline for the next comparison
    } else {
      versionManifest.push({
        version: currentTag,
        hasDocs: false,
        compareUrl: null,
      });
    }
  }

  // 3. Write the manifest to the output file
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(
    OUTPUT_FILE,
    JSON.stringify(versionManifest, null, 2),
    "utf-8"
  );
  console.log(`Successfully generated version manifest at ${OUTPUT_FILE}`);
}

main();
