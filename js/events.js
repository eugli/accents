// this is the file where we detect events and
// what page the user is on

let url, modalPoppedUp = false;
const KEY_PRESS_TIMEOUT = 250, KEY_REGISTER_TIMEOUT = 1000;

$(window).ready(function() {
  // first we should detect the website that the user is visiting
  url = window.location.href;

  // if key is valid, key is not shift, and keyup has not been triggered
});


let keyPresses = 0, listening = true, awaitingNumberShortcut = false, prevKeyPressed = '';
let textBox;

// here is where we have every keyboard event happen
$(window).on('keydown', event => {

  // anti ghosting
  if(prevKeyPressed != event.key)
    keyPresses = 0;

  // WHEN MODAL IS NOT SHOWING
  // key of interest
  if(Object.keys(accentLetters).indexOf(event.key) > -1) {
    keyPresses++;
    awaitingNumberShortcut = true;

    // this runs after some time
    if(keyPresses > 1) {
      event.preventDefault();
      // this only runs once
      if(listening) {
        listening = false;
        textBox = document.activeElement;
        show(accentLetters[event.key], false);
      }
      
    }

  }

  // if we are awaiting a potential numbershort cut, 
  // the previously held down key was a key of interest,
  // and the current key is a number
  if(awaitingNumberShortcut && Object.keys(accentLetters).indexOf(prevKeyPressed) > 0 && event.keyCode >= 49 && event.keyCode <= 57 && !modalPoppedUp) {
    console.log('keyboard shortcut inbound');
    event.preventDefault();
    textBox = document.activeElement;
    // passes in the exact letter
    show(accentLetters[prevKeyPressed][modalKeyCodes.indexOf(event.keyCode)], true);
  }

  // WHEN MODAL IS SHOWING
  // if the number just pressed is a valid number and the modal is showing
  if (modalPoppedUp) {
    if(currentKeyCodes.indexOf(parseInt(event.keyCode)) > -1) {
      event.preventDefault(); // prevents number typing
      var id = String.fromCharCode(event.which);
      let button = document.getElementById(id);
      console.log('button: ', button);
      getText(button);
  
      executeAccent();
  
      $("#" + id).css("background-color", "#e4f1ff");
  
      $(".columnAccents").unbind("click");
      $(activeelement).unbind("click keydown");
      $(window).unbind("resize mousedown blur contextmenu");
    }

    // this is the condition to hide the modal on a keypress
    if(keyPresses == 1 || prevKeyPressed != event.key && modalPoppedUp) {
      // removes the modal and reverts the color change
      console.log('yeetee');
      setTimeout(() => {
        $(".modal-popupAccents").remove();
        $("#" + id).css("background-color", "transparent");

        hide(textBox);
      }, HIDE_MODAL_TIMEOUT);
    }
  }

  prevKeyPressed = event.key;
}).on('keyup', event => {
  // key of interest
  if(Object.keys(accentLetters).indexOf(event.key) > -1) {
    keyPresses = 0;
    listening = true;
    awaitingNumberShortcut = false;
  }
});

// placing accent when clicking a button
$('.columnAccents').one('click', event => { // I have no idea why this isnt getting called
  console.log(modalPoppedUp)
  if(modalPoppedUp) {
      console.log('activeElement | event: ', activeElem, event);

      let element = $(event.currentTarget);
  
      getText(element);
  
      // executes the placement of the character
      executeAccent();
  
      // unbinds the possible events
      $(".columnAccents").unbind("click");
      $(activeelement).unbind("click keydown");
      $(window).unbind("resize click blur contextmenu");
  
      // removes the modal and reverts the color change 
      // from the :active selector on the button clicked
      setTimeout(() => {
          $(".modal-popupAccents").remove();
  
          hide(activeElement);
      }, HIDE_MODAL_TIMEOUT);
  }
});

// handles which pag
function eventHandler(key, numberKey = null) {

  activeElement = document.activeElement;
  console.log('event handler called with ', key, numberKey)
  // if the page is a Google Docs document
  if(/docs.google.com\/document\/d/g.test(url)) {
    console.log("Setting up Google Docs environment...");

  }
  // generateModal(accentLetters[key]);
} 