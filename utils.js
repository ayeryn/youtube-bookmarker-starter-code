/**
 * Retrieves the URL of the active tab.
 * @returns {Promise<chrome.tabs.Tab>} A promise that resolves to the active tab.
 * code from chrome API doc
 */
export async function getActiveTabURL() {
  let queryOptions = { active: true, lastFocusedWindow: true }; // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
