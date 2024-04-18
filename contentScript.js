(() => {
  let youtubeLeftControls, youtubePlayer;
  let currentVideo = "";
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

  const newVideoLoaded = async () => {
    const bookmarkBtnExists =
      document.getElementsByClassName("bookmark-btn")[0];
    // console.log(bookmarkBtnExists);

    // add a bookmark button to the page
    if (!bookmarkBtnExists) {
      const bookmarkBtn = document.createElement("img");

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

  newVideoLoaded();
})();
