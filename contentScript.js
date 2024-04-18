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
})();
