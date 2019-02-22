// this is the file where we detect events and
// what page the user is on

let url, keyDown = false, eventCount = 0, modalPoppedUp = false, modalEvents = false;
const KEY_PRESS_TIMEOUT = 250, KEY_REGISTER_TIMEOUT = 1000;

$(window).ready(function() {
  // first we should detect the website that the user is visiting
  url = window.location.href;

  // if key is valid, key is not shift, and keyup has not been triggered
});

// when keypressed
$(window).on('keydown', event => {
  if(Object.keys(accentLetters).indexOf(event.key) > 0 && keyDown && !modalEvents) {
    // wait for at least one keypress to register
    console.log('it works!');
    event.preventDefault(); // prevent spamming of that key

  }

  // this part only runs once
  // if it is a key of interest and 
  if(keyDown && Object.keys(accentLetters).indexOf(event.key) > 0 && !modalEvents) {
    modalEvents = true;
    setTimeout(function() {
      // check if after some time the key is still pressed
      keyDown ? eventHandler(event) : null;
    }, KEY_PRESS_TIMEOUT);
    
  }

  keyDown = true;
  // eventCount++;
}).on('keyup', event => {
  keyDown = false;
  if(event.keyCode != 16) {
    eventCount = 0;
  }

  if(modalPoppedUp && modalEvents) {
    console.log('detecting modal events');
    detectEvent();
    modalEvents = false; 
  }
    
});


// handles which pag
function eventHandler(event) {
  let key = event.key;
  // console.log('event handler');
  console.log('calling even handlers');

  lastFocus = document.activeElement;
  // if the page is a Google Docs document
  if(/docs.google.com\/document\/d/g.test(url)) {
    console.log("Setting up Google Docs environment...");

  }

  show(accentLetters[key]);
  // generateModal(accentLetters[key]);
  modalPoppedUp = true;
}