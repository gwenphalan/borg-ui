import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

const DOCS_ROOT = "docs";
const OUTPUT_FILE = path.join("src", "data", "nav-manifest.json");
const EXCLUDED_ITEMS = ["images", "assets"];

/**
 * Converts a filename or directory name into a title.
 * e.g., 'getting-started' -> 'Getting Started'
 * e.g., 'button.md' -> 'Button'
 */
function toTitleCase(str) {
  return str
    .replace(/\.md$/, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function parseFrontMatter(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    const { data } = matter(content);
    return data || {};
  } catch {
    return {};
  }
}

/**
 * Recursively scans the docs directory to build a navigation structure.
 */
async function generateNav(dir, isRoot = false) {
  const dirents = await fs.readdir(dir, { withFileTypes: true });
  const items = [];
  let indexMeta = null;
  let indexPath = "";

  // Find the index file first to establish the root of this level
  const indexDirent = dirents.find((d) => d.name === "_.md");
  if (indexDirent) {
    const fullPath = path.join(dir, indexDirent.name);
    indexMeta = await parseFrontMatter(fullPath);
    indexPath = fullPath
      .replace(DOCS_ROOT, "")
      .replace(/\\/g, "/")
      .slice(1)
      .replace(/\.md$/, "");
  }

  for (const dirent of dirents) {
    if (EXCLUDED_ITEMS.includes(dirent.name) || dirent.name === "_.md") {
      continue;
    }

    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      const childNav = await generateNav(fullPath);
      if (childNav) {
        items.push(childNav);
      }
    } else if (dirent.name.endsWith(".md")) {
      const meta = await parseFrontMatter(fullPath);
      if (meta.hidden) continue;
      items.push({
        title: meta.title || toTitleCase(dirent.name),
        path: fullPath
          .replace(DOCS_ROOT, "")
          .replace(/\\/g, "/")
          .slice(1)
          .replace(/\.md$/, ""),
        order: meta.order || 0,
      });
    }
  }

  items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  if (indexMeta && !indexMeta.hidden) {
    let sectionPath = indexPath.replace(/\/_$/, "");
    return {
      title: indexMeta.title || toTitleCase(path.basename(dir)),
      path: sectionPath,
      order: indexMeta.order || 0,
      children: items.length > 0 ? items : undefined,
    };
  }

  if (isRoot) {
    return items;
  }

  if (items.length > 0) {
    return items.length === 1
      ? items[0]
      : { title: toTitleCase(path.basename(dir)), children: items };
  }

  return null;
}

export async function buildNavStructure(docsRoot) {
  const nav = await generateNav(docsRoot, true);
  return Array.isArray(nav) ? nav : [nav];
}

async function main() {
  console.log("Generating navigation manifest...");
  try {
    const finalNav = await buildNavStructure(DOCS_ROOT);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(finalNav, null, 2));
    console.log(`Successfully generated navigation manifest at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error generating navigation manifest:", error);
    process.exit(1);
  }
}

if (
  import.meta.url.startsWith("file:") &&
  process.argv[1] === new URL(import.meta.url).pathname
) {
  main();
}
