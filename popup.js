import { getActiveTabURL } from "./utils.js";

// adding a new bookmark row to the popup
const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = (e) => {};

const onDelete = (e) => {};

const setBookmarkAttributes = () => {};

// When we want to load our bookmarks and show them
document.addEventListener("DOMContentLoaded", async () => {
  // get current tab URL
  const activeTab = await getActiveTabURL();
  // get url parameters, aka stuff after watch?
  const queryParameters = activeTab.url.split("?")[1];
  // Build URLSearchParams object with url parameters
  const urlParameters = new URLSearchParams(queryParameters);
  // Get video ID
  const currentVideo = urlParameters.get("v");

  // Check if current tab is Youtube
  if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
    // (data) -> {currentVideo: [bookmarks]}
    // Note: clear caches doesn't clear chrome.storage
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];
    });
    console.log("data:", data, "; check content: ", data[currentVideo]);
  } else {
    // Display info if not Youtube
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      "<div class='title'>This is not a Youtube Video Page</div>";
  }
});
