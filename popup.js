let scrollTimeout;
let actionTimeout;

document.getElementById("enableButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: likeAndScrollAutomation,
    });
  });
});

document.getElementById("stopButton").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: stopAutomation,
    });
  });
});

function likeAndScrollAutomation() {
  window.autoLikeScrollEnabled = true;

  function randomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function likePost() {
    if (!window.autoLikeScrollEnabled) return;

    const likeButton = document.querySelector('svg[aria-label="Like"]');
    if (likeButton) {
      likeButton.scrollIntoView({ behavior: "smooth", block: "center" });
      likeButton.closest('div[role="button"]').focus();
      const clickEvent = new MouseEvent("click", {
        view: window,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      likeButton.closest('div[role="button"]').dispatchEvent(clickEvent);
      console.log("Post liked!");
    } else {
      console.log("Like button not found on this post.");
    }
  }

  function scrollToNextPost() {
    if (!window.autoLikeScrollEnabled) return;

    window.scrollBy({
      top: window.innerHeight,
      left: 0,
      behavior: "smooth",
    });
    console.log("Scrolling to the next post...");
  }

  function likeAndScroll() {
    if (!window.autoLikeScrollEnabled) {
      console.log("Automation stopped. Exiting loop.");
      return;
    }

    likePost();
    scrollTimeout = setTimeout(scrollToNextPost, randomDelay(2000, 5000));
    actionTimeout = setTimeout(likeAndScroll, randomDelay(4000, 8000));
  }

  actionTimeout = setTimeout(likeAndScroll, randomDelay(1000, 3000));
}

function stopAutomation() {
  window.autoLikeScrollEnabled = false;
  clearTimeout(scrollTimeout);
  clearTimeout(actionTimeout);
  console.log("Automation stopped.");
}
