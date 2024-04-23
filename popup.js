import { getActiveTabURL } from "./utils.js";

/**
 * Adds a new bookmark to popup.html.
 *
 * @param {object} bookmark - The bookmark object to be added.
 *
 */
const addNewBookmark = (bookmark) => {
  // console.log(typeof bookmark);
  return `<div class='bookmark'>${bookmark.desc}<div>`;
};

/**
 * Displays the bookmarks for the current video.
 *
 * @param {Array} currentVideoBookmarks - The array of bookmarks for the current video.
 */
const viewBookmarks = (currentVideoBookmarks) => {
  const bookmarks = document.getElementById("bookmarks");
  // Initialize to empty
  bookmarks.innerHTML = "";
  for (let i = 0; i < currentVideoBookmarks.length; i++) {
    const bookmark = currentVideoBookmarks[i];
    bookmarks.innerHTML += addNewBookmark(bookmark);
  }
};

const onPlay = (e) => {};

const onDelete = (e) => {};

const setBookmarkAttributes = () => {};

/**
 * Adds an event listener for the "DOMContentLoaded" event and performs actions based on the current tab URL.
 */
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
    /**
     * Retrieves the bookmarks for the current video from the Chrome sync storage.
     *
     * @param {string} currentVideo - The key used to retrieve the bookmarks for the current video.
     * @param {function} callback - The callback function to be executed after retrieving the bookmarks.
     * (data) -> {currentVideo: [bookmarks]}
     *
     * NOTE: clear caches doesn't clear chrome.storage
     */
    chrome.storage.sync.get([currentVideo], (data) => {
      const currentVideoBookmarks = data[currentVideo]
        ? JSON.parse(data[currentVideo])
        : [];

      console.log(currentVideoBookmarks);
      // Add existing bookmarks to html
      viewBookmarks(currentVideoBookmarks);
    });
  } else {
    // Display info if not Youtube
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML =
      "<div class='title'>This is not a Youtube Video Page</div>";
  }
});
