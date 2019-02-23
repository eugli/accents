// to possibly do later: 
// customization of keys, w/e characters and emojis desired
// send an email to spanish learning websites asking
// them to maybe post it on the pages where they explain how to write accents

// to-do:
// fix contentEditable

// issues:
// "content_scripts": [{
//     "matches": [
//         "<all_urls>"
//     ],
//     "css": [
//         "css/style.css"
//     ],
//     "js": [
//         "js/jquery-3.3.1.min.js",
//         "js/accentLetters.js",
//         "js/main.js",
//         "js/getCaret.js"
//     ],
//     "run_at": "document_end",
//     "persistent": false
// }],

// Google Docs

// graphics, logo, description, keywords
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// stores the allowed elements for the modal
const inputs = ["input", "select", "button", "textarea", "div"];

// stores the pre-modal clipboard data
var clipboardSaved;

// saves the pre-modal clipboard data upon receiving the message from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data) {
        clipboardSaved = request.data;
        // console.log(clipboardSaved);
    }
});