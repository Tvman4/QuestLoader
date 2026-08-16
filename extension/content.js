// Injects a QuestLoader action panel into Meta Store pages
(function () {
  'use strict';

  function injectDownloadButton() {
    if (document.getElementById('questloader-container')) return;

    const targetContainer = document.querySelector('div[role="main"]') || document.body;
    if (!targetContainer) return;

    const panel = document.createElement('div');
    panel.id = 'questloader-container';
    panel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 999999;
      background: #18191a;
      color: #fff;
      padding: 14px 18px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border: 1px solid #3a3b3c;
    `;

    panel.innerHTML = `
      <div style="font-weight: 600; font-size: 14px; display: flex; align-items: center; justify-content: space-between;">
        <span>QuestLoader</span>
        <span style="font-size: 10px; background: #2d88ff; padding: 2px 6px; border-radius: 4px;">Free APK</span>
      </div>
      <button id="questloader-btn" style="
        background: #2d88ff;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      ">Download Free APK</button>
    `;

    document.body.appendChild(panel);

    document.getElementById('questloader-btn').addEventListener('click', () => {
      const currentUrl = window.location.href;
      chrome.runtime.sendMessage({ action: "fetch_apk", url: currentUrl }, (response) => {
        if (chrome.runtime.lastError) {
          alert("QuestLoader Error: " + chrome.runtime.lastError.message);
        } else {
          alert("Request sent to background worker for processing.");
        }
      });
    });
  }

  const observer = new MutationObserver(() => {
    if (window.location.href.includes('/experiences/')) {
      injectDownloadButton();
    }
  });

  observer.observe(document, { childList: true, subtree: true });
})();
