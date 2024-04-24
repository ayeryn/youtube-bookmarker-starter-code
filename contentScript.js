/**
 * This code snippet listens to messages from the background.js file and performs actions based on the message type.
 */
(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
  let currentVideoBookmarks = [];

  /**
   * Listens to messages from the background.js file and performs actions based on the message type.
   * @param {Object} obj - The message object received from the background.js file.
   * @param {Object} sender - The sender of the message.
   * @param {Function} response - The response function to send back a response to the background.js file.
   */
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, value, videoId } = obj;

    if (type === "NEW") {
      // new bookmark
      currentVideo = videoId;
      newVideoLoaded();
    } else if (type === "PLAY") {
      // play video from bookmarked timestamp
      youtubePlayer.currentTime = value;
    } else if (type === "DELETE") {
      // delete bookmark from chrome.storage
    }
  });

  /**
   * Fetches bookmarks from Chrome storage for the current video.
   * @returns {Promise<Array>} A promise that resolves to an array of bookmarks.
   */
  const fetchBookmarks = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get([currentVideo], (obj) => {
        resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
      });
    });
  };

  /**
   * Performs actions when a new video is loaded.
   */
  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];

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
   */
  const addNewBookmarkEventHandler = async () => {
    const currentTime = youtubePlayer.currentTime;
    const newBookmark = {
      time: currentTime,
      desc: "Bookmark at " + getTime(currentTime),
    };
    currentVideoBookmarks = await fetchBookmarks();

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
  return date.toISOString().substring(11, 19);
};
