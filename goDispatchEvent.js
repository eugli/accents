var evt = document.createEvent("KeyboardEvent");
// Chrome hack
Object.defineProperty(evt, 'keyCode', {
    get : function(){
        return this.keyCodeVal;
    }
});
Object.defineProperty(evt, 'which', {
    get : function(){
        return this.keyCodeVal
    }
});
Object.defineProperty(evt, 'charCode', {
    get : function(){
        return this.charCodeVal
    }
});
//initKeyBoardEvent seems to have different parameters in chrome according to MDN KeyboardEvent(sorry, can't post more than 2 links), but that did not work either
evt.initKeyboardEvent("keydown",
    true,//bubbles
    true,//cancelable
    window,
    false,//ctrlKey,
    false,//altKey,
    false,//shiftKey,
    false,//metaKey,
    8,//keyCode,
    8//charCode
);

evt.charCodeVal = 8;
evt.keyCodeVal = 8;