(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];
  // listen to background.js
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    // deconstruct the message
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      // add bookmark to list
      currentVideo = videoId;
      newVideoLoaded();
    }
  });

  /**
   * Fetches bookmarks from Chrome storage for current video
   * @returns {Promise<Array>} A promise that resolves to an array of bookmarks.
   */
  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

    // add a bookmark button to the page
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");
      currentVideoBookmarks = await fetchBookmarks();

      bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
      bookmarkBtn.className = "ytp-button " + "bookmark-btn";
      bookmarkBtn.title = "Click to bookmark current timestamp";

      youtubeLeftControls =
        document.getElementsByClassName("ytp-left-controls")[0];
      youtubePlayer = document.getElementsByClassName("video-stream")[0];

      youtubeLeftControls.appendChild(bookmarkBtn);
      bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
    }
  };

  /**
   * Adds a new bookmark to the current video.
   * @async
   * @function addNewBookmarkEventHandler
   * @returns {Promise<void>}
   */
  const addNewBookmarkEventHandler = async () => {
    // Returns current time of youtube player in seconds
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };

    // make sure we always have the freshest set of bookmarks
    // for currentVideo
    currentVideoBookmarks = await fetchBookmarks();

    // save new bookmark to chrome storage, and
    // sort by time in ascending order
    chrome.storage.sync.set({
      [currentVideo]: JSON.stringify(
        [...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time)
      ),
    });
  };

  newVideoLoaded();
})();

const getTime = (t) => {
  // Convert seconds to standard time format
  var date = new Date(0);
  date.setSeconds(t);
  return date.toISOString().substring(11, 8);
};
