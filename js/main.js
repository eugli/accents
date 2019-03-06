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

// to possibly do later: 
// customization of keys, w/e characters and emojis desired (low priority)
// send an email to spanish learning websites asking
// them to maybe post it on the pages where they explain how to write accents

// to-do:
// fix position on google classroom comments
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