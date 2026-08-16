window.addEventListener('load', () => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  container.style.background = '#111';
  container.style.padding = '12px';
  container.style.borderRadius = '8px';
  container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';

  const btn = document.createElement('button');
  btn.innerText = 'Download APK';
  btn.style.background = '#0066ff';
  btn.style.color = '#fff';
  btn.style.border = 'none';
  btn.style.padding = '8px 14px';
  btn.style.borderRadius = '4px';
  btn.style.cursor = 'pointer';

  btn.onclick = () => {
    const urlParts = window.location.pathname.split('/');
    const appSlug = urlParts[2];
    
    if (!appSlug) {
      alert("QuestLoader: Could not identify app from URL.");
      return;
    }

    alert(`QuestLoader: Fetching package configuration for ${appSlug}...`);
    chrome.runtime.sendMessage({ action: "fetchAndDownload", appSlug });
  };

  container.appendChild(btn);
  document.body.appendChild(container);
});
