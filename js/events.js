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
let activeElement;

$(window).on('keydown', event => {
  // key of interest
  if(Object.keys(accentLetters).indexOf(event.key) > 0) {
    keyPresses++;
    awaitingNumberShortcut = true;

    // this runs after some time
    if(keyPresses > 1) {
      event.preventDefault();
      // this only runs once
      if(listening) {
        listening = false;
        eventHandler(event.key);
      }
      
    }

  }

  // if we are awaiting a potential numbershort cut, 
  // the previously held down key was a key of interest,
  // and the current key is a number
  if(awaitingNumberShortcut && Object.keys(accentLetters).indexOf(prevKeyPressed) > 0 && event.keyCode >= 49 && event.keyCode <= 57) {
    event.preventDefault();
    eventHandler(prevKeyPressed, event.key);
  }

  prevKeyPressed = event.key;
}).on('keyup', event => {
  // key of interest
  if(Object.keys(accentLetters).indexOf(event.key) > 0) {
    keyPresses = 0;
    listening = true;
  }
});


// handles which pag
function eventHandler(key, numberKey = null) {

  lastFocus = document.activeElement;
  // if the page is a Google Docs document
  if(/docs.google.com\/document\/d/g.test(url)) {
    console.log("Setting up Google Docs environment...");

  }

  show(accentLetters[key]);
  // generateModal(accentLetters[key]);
  modalPoppedUp = true;
}