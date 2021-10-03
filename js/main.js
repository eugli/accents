// storage: 
// "content_scripts": [{
//     "matches": [
//         "<all_urls>"
//     ],
//     "js": [
//         "js/jquery-3.3.1.min.js",
//         "js/main.js",
//         "js/getCaret.js",
//         "js/modal.js",
//         "js/events.js",
//         "js/placeChar.js"
//     ],
//     "run_at": "document_end",
//     "persistent": false
// }],

// to-do:
// customization of keys, adding as characters and emojis desired
// fix contentEditable deletion
// exclamation mark bug

// issues:
// Google Docs
// Gmail
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// stores the pre-modal clipboard data
var clipboardSaved;

// saves the pre-modal clipboard data upon receiving the message from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data) {
        clipboardSaved = request.data;
    }
});