import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import simpleGit from "simple-git";
import conventionalChangelog from "conventional-changelog-core";

const git = simpleGit();

/**
 * Bumps the version using standard-version without creating a changelog, commit, or tag.
 */
async function bumpVersion() {
  console.log("Bumping version...");
  execSync("npx standard-version --skip.changelog --skip.commit --skip.tag", {
    stdio: "inherit",
  });
}

/**
 * Generates the changelog content for the latest version.
 * @param {string} version - The new version number.
 * @returns {Promise<string>} The changelog content for the release.
 */
function generateChangelogContent(version) {
  return new Promise((resolve, reject) => {
    let content = "";
    const changelogStream = conventionalChangelog(
      { preset: "angular", tagPrefix: "v" },
      { currentTag: `v${version}` },
      { merges: null, path: "." }
    );

    changelogStream.on("data", (chunk) => {
      content += chunk.toString();
    });

    changelogStream.on("end", () => {
      // Remove the first line (the generic version header)
      const lines = content.split("\n").slice(1).join("\n").trim();
      resolve(lines);
    });

    changelogStream.on("error", reject);
  });
}

/**
 * Manages the versioned changelog files.
 * @param {string} version - The new version number.
 * @param {string} content - The changelog content to add.
 */
async function updateChangelogFile(version, content) {
  if (!content) {
    console.log("No new changelog content to write.");
    return;
  }

  const [major, minor] = version.split(".");
  const changelogDir = path.join("docs", "changelogs");
  const targetFilename = `v${major}.${minor}.md`;
  const targetFilePath = path.join(changelogDir, targetFilename);

  await fs.mkdir(changelogDir, { recursive: true });

  let existingContent = "";
  try {
    existingContent = await fs.readFile(targetFilePath, "utf-8");
  } catch (e) {
    // File doesn't exist, it's a new minor/major version
    existingContent = `# Changelog v${major}.${minor}\n\nThis log contains all patch updates for this minor version.`;
  }

  const releaseHeader = `## v${version}`;
  const finalContent = `${existingContent}\n\n${releaseHeader}\n\n${content}`;

  await fs.writeFile(targetFilePath, finalContent.trim() + "\n", "utf-8");
  console.log(`Updated changelog at ${targetFilePath}`);
  await git.add(targetFilePath);
}

/**
 * Commits the version bump and changelog, then creates a tag.
 * @param {string} version - The new version number.
 */
async function commitAndTag(version) {
  console.log("Committing and tagging...");
  const tagName = `v${version}`;
  await git.add(["package.json", "create-borg-ui/package.json"]);
  await git.commit(`chore(release): ${tagName}`);
  await git.addAnnotatedTag(tagName, `Release ${tagName}`);
  console.log(`Successfully created commit and tag for ${tagName}`);
}

async function main() {
  try {
    // Ensure the working directory is clean
    const status = await git.status();
    if (!status.isClean()) {
      console.error(
        "Working directory is not clean. Please commit or stash your changes."
      );
      process.exit(1);
    }

    await bumpVersion();

    // After bumping, require the new package.json to get the version
    const updatedPkg = JSON.parse(await fs.readFile("package.json", "utf-8"));
    const newVersion = updatedPkg.version;

    const changelogContent = await generateChangelogContent(newVersion);
    await updateChangelogFile(newVersion, changelogContent);
    await commitAndTag(newVersion);

    console.log("\nRelease process complete!");
    console.log("Run `git push --follow-tags origin main` to publish.");
  } catch (error) {
    console.error("An error occurred during the release process:", error);
    process.exit(1);
  }
}

main();
