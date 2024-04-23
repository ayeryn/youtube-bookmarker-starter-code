// Get the current or most recently focused tab on chrome
// code from chrome API doc
export async function getActiveTabURL() {
  let queryOptions = { active: true, lastFocusedWindow: true }; // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
