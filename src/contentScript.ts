function extractCommitDetails() {
  const commitMessageElement = document.querySelector(".commit-title");
  const commitMessage =
    commitMessageElement && commitMessageElement.textContent
      ? commitMessageElement.textContent.trim()
      : "No commit message found";

  const commitHashElement = document.querySelector(".sha");
  const commitHash =
    commitHashElement && commitHashElement.textContent
      ? commitHashElement.textContent.trim()
      : "No commit hash found";

  const fileChanges = Array.from(document.querySelectorAll(".file")).map(
    (file) => {
      const filename =
        file.querySelector(".file-header .file-info a")?.textContent || "";
      const changes = Array.from(file.querySelectorAll(".blob-code"))
        .map((line) => line.textContent?.trim() || "")
        .join("\n");
      return { filename, changes };
    },
  );

  return { commitMessage, commitHash, fileChanges };
}

if (
  window.location.href.includes("github.com") &&
  window.location.href.includes("/commit/")
) {
  const commitDetails = extractCommitDetails();

  console.log("Commit Message:", commitDetails.commitMessage);
  console.log("Commit Hash:", commitDetails.commitHash);
  console.log("Changed Files:", commitDetails.fileChanges);

  chrome.runtime.sendMessage(
    {
      type: "review-commit",
      commitMessage: commitDetails.commitMessage,
      commitHash: commitDetails.commitHash,
      fileChanges: commitDetails.fileChanges,
    },
    (response) => {
      console.log("Response from background:", response);
    },
  );
}
