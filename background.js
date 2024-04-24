/**
 * Listens for updates to the Chrome tabs and sends a message to the content script
 * when a YouTube video page is loaded.
 *
 * @param {number} tabId - The ID of the updated tab.
 * @param {object} tab - The updated tab object.
 */
chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    // UTB URL example:
    // https://www.youtube.com/watch?v=UJ7QhP2_0-4

    // Extract query parameters from the URL
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    // Send a message to the content script with the video ID
    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    });
  }
});
