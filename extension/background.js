chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request === "Me want cookie!") {
    chrome.cookies.get({ url: "https://secure.oculus.com", name: "oc_ac_at" }, (cookie) => {
      const accessToken = cookie ? cookie.value : null;
      sendResponse(accessToken);
    });
    return true; // Keep the message channel open for the asynchronous cookie response
  }
});
