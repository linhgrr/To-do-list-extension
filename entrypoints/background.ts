export default defineBackground(() => {
  console.log(chrome.runtime.id);

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getCookies"){
      chrome.cookies.getAll({ url: "http://localhost:8080" }, (cookies) => {
        console.log("Cookies:", cookies);
        sendResponse({ cookies });
      });
      return true; // Indicates that we will send a response asynchronously
    }
  })
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "startAuth") {
      chrome.windows.create(
        {
          url: "http://localhost:8080/auth/google",
          type: "popup",
          width: 500,
          height: 600,
        },
        async (newWindow) => {
          const authWindowId = newWindow.id;
          try {
            const access_token = await trackLogin(authWindowId);
            sendResponse({ access_token });
          } catch (error) {
            console.error("Error during authentication:", error);
            sendResponse({ error: "Authentication failed" });
          }
        }
      );
      return true; // Indicates that we will send a response asynchronously
    }
  });

  async function trackLogin(windowId: number) {
  return new Promise((resolve, reject) => {
    chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo, tab) {
      if (
        tab.windowId === windowId &&
        changeInfo.url &&
        changeInfo.url.includes("http://localhost:8080/auth/google/callback")
      ) {
        chrome.tabs.onUpdated.removeListener(listener);

        // Đóng tab
        chrome.tabs.remove(tabId, () => {
          // Lấy cookie sau khi tab đã được đóng
          chrome.cookies.get({ url: "http://localhost:8080", name: "access_token" }, (cookie) => {
            if (cookie) {
              console.log("Access Token:", cookie.value);
              resolve(cookie.value);
            } else {
              reject(new Error("Cookie không tìm thấy"));
            }
          });
        });
      }
    });
  });
}
});