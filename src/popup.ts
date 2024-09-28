function getCurrentTabUrl(callback: (url: string) => void) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const tabUrl = tabs[0].url;
      if (tabUrl) {
        callback(tabUrl);
      }
    }
  });
}

const submitButton = document.getElementById("submit") as HTMLButtonElement;
const commitInput = document.getElementById("commit-url") as HTMLInputElement;

// Pre-fill the commit URL with the current tab's URL
getCurrentTabUrl((url) => {
  commitInput.value = url || "";
});

submitButton.addEventListener("click", () => {
  const commitMessage = commitInput.value.trim();

  if (!commitMessage) {
    alert("Please enter a commit message or URL.");
    return;
  }

  const resultArea = document.getElementById("result") as HTMLDivElement;
  resultArea.textContent = "Processing...";

  // Send a message to the background script to review the commit
  chrome.runtime.sendMessage(
    { type: "review-commit", commitMessage }, // Send the commit message
    (response) => {
      if (response && response.status === "success") {
        resultArea.textContent = `Review: ${response.review}`;
      } else {
        console.log("Error in response:", response);
        resultArea.textContent = "Error: Unable to get a review.";
      }
    },
  );
});
