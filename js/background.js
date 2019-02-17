// copies the current clipboard data (pre-modal) and sends it to the content script (in Chrome extensions,
// only background scripts can access the clipboard) 

function getContentFromClipboard() {
    var result = "";
    var sandbox = document.getElementById("sandbox");
    sandbox.value = "";
    sandbox.select();
    if (document.execCommand("paste")) {
        result = sandbox.value;
    }
    sandbox.value = "";
    return result;
}

function sendPasteToContentScript(toBePasted) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {type: "paste", data: toBePasted}
        );
    });
}

// runs on page load (before a modal popup is possible)
chrome.tabs.onUpdated.addListener(copyListener);

function copyListener(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete" && tab.active) {
        var clipboardContent = getContentFromClipboard();
        sendPasteToContentScript(clipboardContent);
    }
}

// launches the content scripts
chrome.browserAction.onClicked.addListener(
    function executeScripts(tabs) {
        // FIGURE OUT HOW TO DO THIS
        // chrome.extension.onUpdated.removeListener(executeScripts());
        let scripts = ['js/jquery-3.3.1.min.js', 'js/main.js', 'js/getCaret.js', 'js/modal.js', 'js/events.js'];

        // add jquery
        chrome.tabs.executeScript(tabs[0], { file: "js/jquery-3.3.1.min.js" });

        // add all other scripts
        scripts.forEach(script => {
            chrome.tabs.executeScript(tabs[0], { file: script });
        });

        chrome.tabs.insertCSS(tabs[0], { file: "css/style.css" });
    }
);