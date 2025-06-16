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
  let items = [];
  let indexMeta = null;
  let indexPath = null;

  for (const dirent of dirents) {
    if (EXCLUDED_ITEMS.includes(dirent.name)) continue;

    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      const children = await generateNav(fullPath);
      if (children.length > 0) {
        items.push({
          ...children[0],
          children,
        });
      }
    } else if (dirent.name.endsWith(".md")) {
      if (dirent.name === "_.md") {
        indexMeta = await parseFrontMatter(fullPath);
        indexPath = fullPath
          .replace(DOCS_ROOT, "")
          .replace(/\\/g, "/")
          .slice(1)
          .replace(/\.md$/, "");
      } else {
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
  }
  if (indexMeta && !indexMeta.hidden) {
    let sectionPath = indexPath.replace(/\/_$/, "");
    if (sectionPath !== "") {
      items = [
        {
          title: indexMeta.title || toTitleCase(path.basename(dir)),
          path: sectionPath,
          order: indexMeta.order || 0,
          children: items.length > 0 ? items : undefined,
        },
      ];
    }
  }
  items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  return items;
}

async function main() {
  console.log("Generating navigation manifest...");
  try {
    const nav = await generateNav(DOCS_ROOT, true);
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(nav, null, 2));
    console.log(`Successfully generated navigation manifest at ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Error generating navigation manifest:", error);
    process.exit(1);
  }
}

main();
