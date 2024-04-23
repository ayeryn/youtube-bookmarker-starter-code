import { getActiveTabURL } from "./utils.js";

/**
 * Adds a new bookmark to the bookmarks element.
 *
 * @param {HTMLElement} bookmarksElement - The element that contains the bookmarks.
 * @param {Object} bookmark - The bookmark object to be added.
 * @param {string} bookmark.desc - The description of the bookmark.
 * @param {string} bookmark.time - The timestamp of the bookmark.
 */
const addNewBookmark = (bookmarksElement, bookmark) => {
  const bookmarkTitleElement = document.createElement("div");
  const newBookmarkElement = document.createElement("div");

  bookmarkTitleElement.textContent = bookmark.desc;
  bookmarkTitleElement.className = "bookmark-title";

  // make sure id is unique
  newBookmarkElement.id = "bookmark-" + bookmark.time;
  newBookmarkElement.className = "bookmark";
  newBookmarkElement.setAttribute("timestamp", bookmark.time);

  newBookmarkElement.appendChild(bookmarkTitleElement);
  bookmarksElement.appendChild(newBookmarkElement);
};

/**
 * Displays the bookmarks for the current video.
 *
 * @param {Array} currentVideoBookmarks - The array of bookmarks for the current video.
 */
const viewBookmarks = (currentVideoBookmarks) => {
  const bookmarksElement = document.getElementById("bookmarks");
  // Initialize to empty
  bookmarksElement.innerHTML = "";
  if (currentVideoBookmarks.length > 0) {
    for (let i = 0; i < currentVideoBookmarks.length; i++) {
      const bookmark = currentVideoBookmarks[i];
      addNewBookmark(bookmarksElement, bookmark);
    }
  } else {
    bookmarks.innerHTML = "<i class='row'>No bookmarks to show.</i>";
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
