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

