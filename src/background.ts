async function fetchChatGPTResponse(commitMessage: string): Promise<string> {
  const apiKey = "AIzaSyAa0sTiqzUfUFYaeb4_UddzIakRb_rzpvc";
  const link = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
  console.log(commitMessage);
  try {
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
                text: commitMessage,
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
    return true;
  }
});
