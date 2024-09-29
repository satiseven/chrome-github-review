interface CommitDetails {
  commitMessage: string;
  commitHash: string;
  fileChanges: Array<FileChange>;
}

interface FileChange {
  filename: string;
  changes: string;
}

async function fetchChatGPTResponse(
  commitDetails: CommitDetails,
): Promise<string> {
  const apiKey = "";
  const link = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  try {
    // Handle undefined fileChanges safely
    const fileChanges =
      commitDetails.fileChanges && Array.isArray(commitDetails.fileChanges)
        ? commitDetails.fileChanges
        : [];

    const prompt = `
    Commit Message: ${commitDetails.commitMessage}
    Commit Hash: ${commitDetails.commitHash}
    Changed Files: 
    ${fileChanges
      .map(
        (file: FileChange) => `
      File: ${file.filename}
      Changes: 
      ${file.changes}
    `,
      )
      .join("\n")}
    Please review this commit.
  `;
    console.log("Prompt:", prompt);
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(data);
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].content.parts[0].text.trim();
    } else {
      return "No review available.";
    }
  } catch (error) {
    console.error("Error fetching ChatGPT response:", error);
    return "Error fetching the review.";
  }
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background script:", message);

  if (message.type === "review-commit") {
    // Perform asynchronous task
    fetchChatGPTResponse(message.commitMessage)
      .then((review) => {
        console.log("Fetched review:", review);
        sendResponse({ status: "success", review });
      })
      .catch((error) => {
        console.error("Error fetching ChatGPT response:", error);
        sendResponse({ status: "error", error });
      });

    // Return true to indicate asynchronous response
    return true; // Important! Keeps the message channel open for sendResponse
  }
});
