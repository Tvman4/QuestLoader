chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fetchAndDownload") {
    chrome.cookies.get({ url: "https://secure.oculus.com", name: "oc_ac_at" }, (cookie) => {
      const accessToken = cookie ? cookie.value : null;

      if (!accessToken) {
        console.error("QuestLoader Error: Not authenticated. Log into secure.oculus.com first.");
        alert("QuestLoader Error: Please log into secure.oculus.com first.");
        return;
      }

      // Query Meta's GraphQL endpoint to resolve the application details and binary assets
      fetch(`https://graph.oculus.com/graphql?access_token=${accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variables: { input: { entry_point: "store", uri: request.appSlug } },
          doc_id: "7247610058641973"
        })
      })
      .then(res => res.json())
      .then(response => {
        const item = response?.data?.item;
        if (!item) {
          throw new Error("App metadata could not be resolved from Meta servers.");
        }

        const binaryId = item.binary?.id || item.latest_supported_binary?.id;
        const appTitle = item.display_name || request.appSlug;

        if (!binaryId) {
          throw new Error("No downloadable binary package found for this title.");
        }

        // Construct the direct authenticated CDN download stream URL
        const downloadUrl = `https://securecdn.oculus.com/binaries/download/?id=${binaryId}&access_token=${accessToken}`;

        console.log(`QuestLoader: Initiating download for ${appTitle} (${binaryId})`);

        // Trigger the browser download manager to pull the binary file
        chrome.downloads.download({
          url: downloadUrl,
          filename: `${appTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.apk`,
          saveAs: true
        });
      })
      .catch(err => {
        console.error("QuestLoader Error:", err);
        alert(`QuestLoader Error: ${err.message}`);
      });
    });
  }
});
