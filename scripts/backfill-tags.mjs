import simpleGit from "simple-git";
import fs from "fs";

const git = simpleGit();

async function backfillTags() {
  try {
    console.log("Starting tag backfill process...");

    // 1. Get all existing tags and store them in a Set for quick lookups
    const existingTags = await git.tags();
    const tagSet = new Set(existingTags.list.map((tag) => tag.name));
    console.log(`Found ${tagSet.size} existing tags.`);

    // 2. Get the commit history of the main branch
    const log = await git.log(["main"]);
    const commits = log.all.reverse(); // Process from oldest to newest
    console.log(`Analyzing ${commits.length} commits...`);

    const taggedVersions = new Set();

    // 3. Iterate through each commit to check its package.json
    for (const commit of commits) {
      try {
        // Get the content of package.json at the specific commit
        const packageJsonContent = await git.show([
          `${commit.hash}:package.json`,
        ]);
        const packageData = JSON.parse(packageJsonContent);
        const version = packageData.version;
        const tagName = `v${version}`;

        // 4. Check if this version has been processed and if the tag already exists
        if (version && !taggedVersions.has(version) && !tagSet.has(tagName)) {
          console.log(
            `Found untagged version ${version} at commit ${commit.hash.substring(
              0,
              7
            )}.`
          );

          // 5. Create a new annotated tag
          await git.addTag(tagName, [
            `-m "Release version ${version}"`,
            commit.hash,
          ]);

          console.log(`Successfully created tag: ${tagName}`);
          taggedVersions.add(version); // Mark this version as tagged in this run
          tagSet.add(tagName); // Add to our set of all tags
        } else if (
          version &&
          !taggedVersions.has(version) &&
          tagSet.has(tagName)
        ) {
          // If the tag exists but we haven't processed this version string yet
          // it means we've found the commit where this version was first introduced.
          // We can now ignore this version string for all subsequent (older) commits.
          taggedVersions.add(version);
        }
      } catch (e) {
        // This will happen for commits before package.json existed. It's safe to ignore.
        if (e.message.includes("exists on disk, but not in")) {
          continue;
        }
        // Log other potential errors
        console.warn(
          `Could not process commit ${commit.hash.substring(0, 7)}: ${
            e.message
          }`
        );
      }
    }

    console.log("Tag backfill process completed.");
    if (taggedVersions.size === 0) {
      console.log("No new versions found to tag.");
    } else {
      console.log(`Created tags for ${taggedVersions.size} new version(s).`);
    }
  } catch (error) {
    console.error("An error occurred during the tag backfill process:");
    console.error(error);
    process.exit(1);
  }
}

backfillTags();
