const shiftDown = /([AEIOUSLZNC])/g
const shiftUp = /([?!"'])/g
var poppedUp = false;
var done = false;
var key;
var numbers;
var interval;
var text;
var left;

$(window).ready(function () {
    checkForModal();
});

function checkForModal() {
    $(window).on("keypress", function(e) {
        if(key != e.key && interval == null) {
            key = e.key;
            console.log(key);

            interval = setTimeout(function() {
                if (accentLetters[key] != undefined && "selectionStart" in document.activeElement) {
                    console.log("modal");
                    poppedUp = true;
                    if (poppedUp)
                    {
                        console.log("key handler");
                    }
                    //prevents keypress from triggering immediately
                }
            }, 400);
        }
    }).on("keyup", function(e) {
        if (e.keyCode != 16) {
            clearInterval(interval); 
            key = "";
            interval = null;
            poppedUp = false;
        }
    });
}