// handles events and the page the user is on

let url;

$(window).ready(function() {
  // stores the website the user is on
  url = window.location.href;
  launchExtension();
});

// stores whether the modal is listened for, whether the modal is popped up, whether the shortcut should be executed,
// the keydown count, the previous key pressed, and the text box
let listening = true, modalPoppedUp = false, awaitingNumberShortcut = false, 
    keyPresses = 0, prevKeyPressed = "", textBox;

function launchExtension() {
  // starts detecting for modal
  $(window).on("keydown", event => {
    // handles anti-ghosting
    // if the key pressed is unique from the last one
    if (prevKeyPressed != event.key) {
      keyPresses = 0;

      // stores that the shortcut can happen here 
      awaitingNumberShortcut = true;
    }

    // if the key is usable, the text box is available, and the text box is not a password field 
    if (Object.keys(accentLetters).indexOf(event.key) > -1 && inputs.indexOf(document.activeElement.tagName.toLowerCase()) != -1 && document.activeElement.type != "password") {
      keyPresses++;

      // runs when key would repeat on hold
      if (keyPresses > 1) {
        // prevents typing the key again
        event.preventDefault();

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
        var id = String.fromCharCode(event.which);
        let button = document.getElementById(id);

        // executes the placement of the character
        executeAccent(getText(button));
        textBox.focus();

        // changes button background color
        $("#" + id).css("background-color", "#e4f1ff !important");
        console.log(id)
      }

      // if a key is pressed
      // hides the modal
      console.log(keyPresses)
      if (keyPresses == 1 || prevKeyPressed != event.key && modalPoppedUp) {
        setTimeout(() => {
          console.log("called")
          hide(textBox);
        }, HIDE_MODAL_TIMEOUT);
      }
    }

    prevKeyPressed = event.key;
  }).on("keyup", event => {
    keyPresses = 0;
    awaitingNumberShortcut = false;

    // if the key has an accent
    // resets the conditions
    if (Object.keys(accentLetters).indexOf(event.key) > -1) {
      listening = true;
      awaitingNumberShortcut = false;
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
    $(window).one("resize scroll contextmenu", e => {
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

// if ($('.kix-cursor.docs-ui-unprintable') != null) {
//     // this is google docs
//     activeelement = $('.kix-cursor.docs-ui-unprintable');
// }