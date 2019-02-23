// handles events and the page the user is on

let url;

$(window).ready(function() {
  // stores the website the user is on
  url = window.location.href;
});

// stores whether the modal is listened for, whether the modal is popped up, whether the shortcut should be executed,
// the keydown count, the previous key pressed, and the text box
let listening = true, modalPoppedUp = false, awaitingNumberShortcut = false, 
    keyPresses = 0, prevKeyPressed = "", textBox;

// handles all the events
$(window).on("keydown", event => {
  // handles anti-ghosting
  // if the key pressed is unique from the last one
  if (prevKeyPressed != event.key) {
    keyPresses = 0;
  }

  // if modal is not showing
  if (Object.keys(accentLetters).indexOf(event.key) > -1 && inputs.indexOf(document.activeElement.tagName.toLowerCase()) != -1 && document.activeElement.type != "password") {
    keyPresses++;

    // executes shortcut if conditions are met here
    awaitingNumberShortcut = true;

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

        // gets the caret position
        getKeyPosition(event.key);
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
      getText(button);
  
      // executes the placement of the character
      executeAccent();
  
      // changes button background color
      $("#" + id).css("background-color", "#e4f1ff");
    }

    // if a key is pressed
    // hides the modal
    if (keyPresses == 1 || prevKeyPressed != event.key && modalPoppedUp) {
      setTimeout(() => {
        $("#" + id).css("background-color", "#e4f1ff");
        hide(textBox);
      }, HIDE_MODAL_TIMEOUT);
    }
  }

  prevKeyPressed = event.key;
}).on("keyup", event => {
  // if the key has an accent
  // resets the conditions
  if (Object.keys(accentLetters).indexOf(event.key) > -1) {
    keyPresses = 0;
    listening = true;
    awaitingNumberShortcut = false;
  }
});

// unbinds the possible events
function unbindEvents() {
      $(".columnAccents").unbind("click");
      $(textBox).unbind("click keydown");
      $(window).unbind("resize click blur contextmenu");
  
}

function handleEvents() {
    // placing accent when clicking a button
    $(".columnAccents").one("click", e => {
      if (modalPoppedUp) {
          // helps with preventing the click from doing other things (I think)
          e.preventDefault();
          e.stopPropagation();

          getText(this);
          console.log(textToBePasted)

          // executes the placement of the character
          executeAccent();

          unbindEvents();

          // hides the modal
          setTimeout(() => {
              hide(textBox);
          }, HIDE_MODAL_TIMEOUT);
      }
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