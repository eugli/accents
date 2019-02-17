// this is the file where we detect events and
// what page the user is on

let url, keyDown = false, eventCount = 0, modalPoppedUp = false;
const KEY_PRESS_TIMEOUT = 250, KEY_REGISTER_TIMEOUT = 1000;

$(window).ready(function() {
  // first we should detect the website that the user is visiting
  url = window.location.href;

  // if key is valid, key is not shift, and keyup has not been triggered
});

// when keypressed
$(window).on('keypress', event => {
  eventCount++;

  if(Object.keys(accentLetters).indexOf(event.key) > 0 && eventCount > 1) {
    // wait for at least one keypress to register
    event.preventDefault(); // prevent spamming of that key
  }

  // this part only runs once
  if(!keyDown && Object.keys(accentLetters).indexOf(event.key) > 0) {
    keyDown = true;

    setTimeout(function() {
      // check if after some time the key is still pressed
      keyDown ? eventHandler(event) : null;
    }, KEY_PRESS_TIMEOUT);
    
  }
}).on('keyup', event => {
  if(event.keyCode != 16) {
    keyDown = false;
    eventCount = 0;
  }
});


// handles which pag
function eventHandler(event) {
  let key = event.key;
  console.log('event handler');

  lastFocus = document.activeElement;
  // if the page is a Google Docs document
  if(/docs.google.com\/document\/d/g.test(url)) {
    console.log("Setting up Google Docs environment...");

  }

  show(accentLetters[key]);
  // generateModal(accentLetters[key]);
  modalPoppedUp = true;
}