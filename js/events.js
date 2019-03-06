// handles events and the page the user is on

let url;

$(window).ready(function() {
  // stores the website the user is on
  url = window.location.href;
  injectCSS();
  launchExtension();
});

// stores the allowed elements for the modal
const inputs = ["input", "select", "button", "textarea"];

// stores whether the modal is listened for, whether the modal is popped up, whether the shortcut should be executed,
// the keydown count, the previous key pressed, and the text box
let listening = true, modalPoppedUp = false, awaitingNumberShortcut = false, 
    keyPresses = 0, prevKeyPressed = "", currentKey = "", textBox;

// injects the styling from the content script to prevent inheritance
function injectCSS() {
  var style = document.createElement("link");
  style.rel = "stylesheet";
  style.type = "text/css";
  style.href = chrome.extension.getURL("css/style.css");
  (document.head || document.documentElement).appendChild(style);
}

function launchExtension() {
  // starts detecting for modal
  $(window).on("keydown", event => {
    if (Object.keys(accentLetters).indexOf(event.key) > -1) {
      // stores that the shortcut can happen here 
      awaitingNumberShortcut = true;
    }

    // handles anti-ghosting
    // if the key pressed is unique from the last one
    if (prevKeyPressed != event.key) {
      keyPresses = 0;
    }

    // if the key is usable, the text box is available, and the text box is not a password field 
    if (Object.keys(accentLetters).indexOf(event.key) > -1 && document.activeElement.type != "password" && 
       (inputs.indexOf(document.activeElement.tagName.toLowerCase()) != -1 || document.activeElement.isContentEditable)) {
      keyPresses++;

      // runs when key would repeat on hold
      if (keyPresses > 1) {
        // prevents typing the key again
        event.preventDefault();
        awaitingNumberShortcut = false;

        // if listening for modal
        // stores the textbox
        // shows the modal
        if (listening) {
          listening = false;
          textBox = document.activeElement;

          // shows the modal by passing in all the possible accents and that the shortcut is not being executed
          show(accentLetters[event.key], false);

          handleEvents();

          if (textBox.isContentEditable) {
            // gets the caret position for contenteditable
            console.log("content editables")
            getKeyPositionContentEditable(textBox, event.key);
          }

          else {
            // gets the caret position
            getKeyPosition(event.key);
          }
        }
      }
    }

    // if timing is right for the shortcut
    // if the previously held down key was a key of interest
    // if the current key is a number
    if (awaitingNumberShortcut && Object.keys(accentLetters).indexOf(prevKeyPressed) > -1 && event.keyCode >= 49 && event.keyCode <= 57 && !modalPoppedUp) {
      console.log(prevKeyPressed);
      console.log("" + currentKey)
      event.preventDefault();
      textBox = document.activeElement;

      // ironically does not show the modal
      // instead, passes in the character to be pasted and that the shortcut is being executed
      show(accentLetters[prevKeyPressed][modalKeyCodes.indexOf(event.keyCode)], true);
    }

    // if the modal is showing
    if (modalPoppedUp) {
      // if the number pressed is a valid number
      if (currentKeyCodes.indexOf(parseInt(event.keyCode)) > -1) {
        // prevents the number from typing
        event.preventDefault();

        // gets the text to be pasted from the activated button 
        var id = "button" + String.fromCharCode(event.which);
        let button = document.getElementById(id);
        console.log(button)

        // executes the placement of the character
        executeAccent(getText(button));
        textBox.focus();

        // changes button background color
        $(button).css({
          "background-color": "#e4f1ff"
        });

        awaitingNumberShortcut = false;
      }

      // if a key is pressed
      // hides the modal
      if (keyPresses == 1 || prevKeyPressed != event.key && modalPoppedUp) {
        setTimeout(() => {
          hide(textBox);
        }, HIDE_MODAL_TIMEOUT);
      }
    }

    prevKeyPressed = event.key;
  }).on("keyup", event => {
    // if the key released is the one of interest
    // if the key is not shift
    // resets tracking variables
    if (prevKeyPressed == event.key || event.which == 16) {
      awaitingNumberShortcut = false;
      keyPresses = 0;
    }

    console.log("prevKeyPressed: " + prevKeyPressed);
    console.log("keyPress: " + keyPresses)
    console.log("event.key: " + event.key)
    console.log("awaitingNumberShortcut:" + awaitingNumberShortcut)

    // if the key has an accent
    // resets the conditions
    if (Object.keys(accentLetters).indexOf(event.key) > -1 || event.which == 16) {
      listening = true;
    }
  });
}


// unbinds the possible events
function unbindEvents() {
    $(".columnAccents").unbind("click");
    $(window).unbind("resize blur scroll contextmenu click");
}

function handleEvents() {
    // placing accent when clicking a button
    $(".columnAccents").one("click", e => {
      // helps with preventing the click from doing other things (I think)
      e.preventDefault();
      e.stopPropagation();

      let textToBePasted = getText(e.currentTarget);

      // executes the placement of the character
      executeAccent(textToBePasted);
      textBox.focus();

      // hides the modal
      setTimeout(() => {
        hide(textBox);
      }, HIDE_MODAL_TIMEOUT);
    });

    // handles a resize, blur, or right click (contxt menu) on the window by removing the modal without executing the character
    $(window).one("resize blur scroll contextmenu", e => {
      // hides the modal
      setTimeout(() => {
        hide(textBox);
      }, HIDE_MODAL_TIMEOUT);
    });

  // handles a mouse down action by removing the modal without executing the character
  // separate to preserve the click action for the modal, but the mouse down action for anywhere else
  $(window).one("click", function(e) {
      // hides the modal
      setTimeout(() => {
        hide(textBox);
      }, HIDE_MODAL_TIMEOUT);
  });
}

// GOOGLE DOCS
//   // if the page is a Google Docs document
//   if  (/docs.google.com\/document\/d/g.test(url)) {
//     console.log("Setting up Google Docs environment...");
//   }

// if ($(".kix-cursor.docs-ui-unprintable") != null) {
//     // this is google docs
//     activeelement = $(".kix-cursor.docs-ui-unprintable");
// }