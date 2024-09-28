// Check if we're on a GitHub commit page and extract commit details
if (
  window.location.href.includes("github.com") &&
  window.location.href.includes("/commit/")
) {
  const commitMessageElement = document.querySelector(".commit-title");
  const commitHashElement = document.querySelector(".sha");
  const fileChanges = Array.from(document.querySelectorAll(".file")).map(
    (file) => {
      const filename =
        file.querySelector(".file-header .file-info a")?.textContent || "";
      const changes = file.querySelector(".file")?.textContent || ""; // You might want to customize how you extract changes
      return { filename, changes };
    },
  );

  const commitMessage =
    commitMessageElement && commitMessageElement.textContent
      ? commitMessageElement.textContent.trim()
      : "No commit message found";
  const commitHash =
    commitHashElement && commitMessageElement?.textContent
      ? commitHashElement?.textContent?.trim()
      : "No commit hash found";

  // Log the extracted information
  console.log("Commit Message:", commitMessage);
  console.log("Commit Hash:", commitHash);
  console.log("Changed Files:", fileChanges);

  // Send the extracted information to the background script for further processing
  chrome.runtime.sendMessage(
    { type: "commit-detected", commitMessage, commitHash, fileChanges },
    (response) => {
      console.log("Response from background:", response);
    },
  );
}
