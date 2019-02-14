function getContentFromClipboard() {
    var result = '';
    var sandbox = document.getElementById('sandbox');
    sandbox.value = '';
    sandbox.select();
    if (document.execCommand('paste')) {
        result = sandbox.value;
        console.log('got value from sandbox: ' + result);
    }
    sandbox.value = '';
    return result;
}

function sendPasteToContentScript(toBePasted) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            {type: 'paste', data: toBePasted}
        );
    });
}

chrome.tabs.onUpdated.addListener(copyListener)

function copyListener(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.active) {
        var clipboardContent = getContentFromClipboard();
        sendPasteToContentScript(clipboardContent);
        console.log("um what")
    }
}

