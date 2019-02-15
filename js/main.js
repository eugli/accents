// to possibly do later: 
// customization of keys, w/e characters and emojis desired

// to do:
// CONTENTEDITABLE KMS AGAIN first
// GOOGLE DOCS KMS second

// issues:
// get proper caret positioning MAJOR
// prevent input triggering twice MAJOR
// keydown to work while held MAJOR
// bigger on google???? MINOR

// should publish after all current issues are resolved (w/o functionality for Google Docs and contenteditable)

// stores the characters for shifting modal positions
const shiftDown = /([AEIOUSZNC])/g
const shiftUpALot = /([?!])/g
const shiftUp = /([""])/g

// stores the allowed elements for the modal
const inputs = ["input", "select", "button", "textarea"];

// stores the state of whether or not the modal is popped up
var poppedUp = false;

// stores the interval used in checkForModal()
var interval;

// stores the key pressed
var key;

// stores the numbers that can be pressed on the modal
var numbers;

// stores the accented character before pasting
// if "NOT WORKING" is pasted--guess what--it is not working
var textToBePasted = "NOT WORKING";

// stores the clipboard data pre-modal
var clipboardSaved;

// stores the focused element
var activeelement;

// stores the previously focused element (the text box)
var lastFocus;

// stores the font size for modal position calculations
var fontSize;

// saves the clipboard data pre-modal upon receiving the message from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data) {
        clipboardSaved = request.data;
        console.log(clipboardSaved);
    }
});

$(window).ready(function () {
    preventInfinity();
    checkForModal();
    preventBlur();
});

// preserves the text box element in case of blur
function preventBlur() {
    $(activeelement).blur(function() {
        lastFocus = this;
    });
}

// prevents repeating keys upon holding down for characters with a modal
function preventInfinity () {
    window.keypressed = {};
    
    $(window).keydown(function(e) {
      if (window.keypressed[e.which] && accentLetters[key] != undefined) {
        e.preventDefault();
      } 
      
      else {
        window.keypressed[e.which] = true;
      }   
    }).keyup(function(e) {
      window.keypressed[e.which] = false;
    });
}

// checks when to pop up the modal
function checkForModal() {
    $(window).on("keypress", function(e) {
        // if key is valid, key is not shift, and keyup has not been triggered
        if (key != e.key && e.keyCode != 16 && interval == null) {
            key = e.key;

            // pops up the modal if the key is held for the interval
            interval = setTimeout(function() {
                // if the character has a modal, the document has an active element, and the element is in those allowed to generate a modal
                if (accentLetters[key] != undefined && document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) !== -1) {
                    activeelement = document.activeElement;
                    lastFocus = activeelement;

                    // logs that the modal has been popped up
                    console.log("modal successful");

                    generateModal(accentLetters[key]);

                    getKeyPosition();

                    // stores that the modal has been popped up
                    poppedUp = true;
                }
            }, 250);
        }
    }).on("keyup", function(e) {
        // resets interval and key if key is not held for the necessary time
        // if key is not shift
        if (e.keyCode != 16) {
            clearInterval(interval);
            interval = null;
            key = "";

            // handles events if modal is popped up
            if (poppedUp)
            {
                clickAndKeyHandler();
            }
        }
    });
}

// injects the HTML into the web page to generate the modal with the given JSON object
function generateModal(object) {
    if (!poppedUp) {
        // deletes the old modal
        $(".modal-popupAccents").remove();

        let columns = "";

        // creates the new modal HTML
        object.forEach((element, iterator) => {
            columns +=
            `<div class="columnAccents">
                <button class="buttonClassAccents" type="button" id=${iterator + 1}>
                    <span class="spanSpecialAccents">
                        <h3 class="topAccents">${element}</h3>
                        <h2 class="bottomAccents">${iterator + 1}</h2>
                    </span>
                </button>
            </div>\n`;
            
            // stores the numbers that can be pressed on the modal
            numbers = iterator;
        });

        let element = 
        `<div class="modal-popupAccents" id="modal-popupAccents">
            ${columns}
        </div>\n`;
        
        // appends the HTML
        $("body").append(element);
    }
}

// handles events that interact with the modal
function clickAndKeyHandler() {
    // handles a click on a modal button by executing the accent
    $(".columnAccents").one("click", async function(e) {
        // prevents the click from clicking away modal immediately
        e.preventDefault();
        e.stopPropagation();

        // ensures text box is focused
        if (lastFocus) {
            setTimeout(function() {lastFocus.focus()}, 1);
        }

        // stores the id of the button pressed
        let id = $(this).children(".buttonClassAccents").attr("id");

        // if modal is popped up
        if (poppedUp) {
            // FIX THIS PART LATER TOO HARD RIGHT NOW MAKE IT A REAL FUNCTION FIX SPACING TOO OK
            var selectionEnd = lastFocus.selectionEnd;

            getText(this);

            console.log("Text to be pasted:" + textToBePasted);
            await copyToClipboard(textToBePasted);

            lastFocus.focus();
            await insertAtCursor(lastFocus, textToBePasted)

            await $(activeelement).val(
                function(index, value){
                return value.substr(0, selectionEnd - 1) + value.substr(selectionEnd);
            });

            // await document.execCommand("paste");
            await setCaretPosition(lastFocus, selectionEnd)
            await copyToClipboard(clipboardSaved);
        }

        // unbinds the other possible events
        $(activeelement).unbind("click keydown");
        $(window).unbind("resize click blur");

        // removes the modal with a color change
        setTimeout(function() {
            $(".modal-popupAccents").remove();
            $("#" + id).css("background-color", "transparent");

            poppedUp = false;
        }, 25);     
    });
    
    // handles a click, resize, or blur on the window by removing the modal without executing the accent
    $(window).one("click resize", function(e) {
        // unbinds the other possible events
        $(".columnAccents").unbind("click");
        $(activeelement).unbind("keydown click");

        // removes the modal
        setTimeout(function() {
            $(".modal-popupAccents").remove();

            poppedUp = false;
        }, 1);
    });

    // handles a click on the text box that is not on the modal by removing the modal without executing the accent
    $(activeelement).one("click", function(e) {
        // unbinds the other possible events
        $(".columnAccents").unbind("click");
        $(window).unbind("resize click blur");
        $(activeelement).unbind("keydown");

         // removes the modal
        setTimeout(function() {
            $(".modal-popupAccents").remove();

            poppedUp = false;
        }, 1);
    });
    // THIS PARTS NEEDS GOD
    // handles a keypress
    $(activeelement).one("keydown", async function(e) {
        // if the key is in the numbers on the modal
        // remove the modal with executing the accent
        if (numbers != null && e.keyCode >= 49 && e.keyCode <= 49 + numbers) {
            e.preventDefault();
            e.stopPropagation();

            if (lastFocus) {
                setTimeout(function() {lastFocus.focus()}, 1);
            }

            let id = String.fromCharCode(e.which);
            let button = document.getElementById(id);

            if (poppedUp) {
                var selectionEnd = lastFocus.selectionEnd;
                console.log(selectionEnd)
                getText(button);
                console.log("Text to be pasted:" + textToBePasted);
                await copyToClipboard(textToBePasted);
                lastFocus.focus();
                await insertAtCursor(lastFocus, textToBePasted)
                await $(activeelement).val(
                            function(index, value){
                            return value.substr(0, selectionEnd - 1) + value.substr(selectionEnd);
                        })
                // await document.execCommand("paste");
                await setCaretPosition(lastFocus, selectionEnd);
                await copyToClipboard(clipboardSaved);
            }
            
            $("#" + id).css("background-color", "#e4f1ff");

            $(".columnAccents").unbind("click");
            $(activeelement).unbind("click");
            $(window).unbind("resize click blur")

           // removes the modal with a color change
            setTimeout(function() {
                $(".modal-popupAccents").remove();
                $("#" + id).css("background-color", "transparent");

                poppedUp = false;
            }, 25); 
        }

        // if the key is not in the number set
        // remove the modal
        else {
            setTimeout(function() {
                $(".modal-popupAccents").remove(); 

                poppedUp = false;
            }, 1);
        }
    });
}

// gets the text to be pasted from the activated button 
function getText(element) {
    let letter = $(element).find(".topAccents").text();
    let number = $(element).find(".bottomAccents").text();

    // logs the character and number of the button activated
    console.log(letter, number);

    // stores the character as the text to be pasted
    textToBePasted = letter;
}

// copies the text to the clipboard
// works through the magic of Stack Overflow, don't ask how
function copyToClipboard(textToBePasted) {
    const el = document.createElement("textarea"); 
    el.value = textToBePasted;                                 
    el.setAttribute("readonly", "");                
    el.style.position = "absolute";                 
    el.style.left = "-9999px";                 
    document.body.appendChild(el);        

    const selected =            
      document.getSelection().rangeCount > 0      
        ? document.getSelection().getRangeAt(0)    
        : false;     

    el.select();                                
    document.execCommand("copy");                  
    document.body.removeChild(el);     

    if (selected) {                                 
      document.getSelection().removeAllRanges();   
      document.getSelection().addRange(selected);
    }   
}

// inserts the text to the desired caret position
// works through the magic of Stack Overflow, don't ask how
function insertAtCursor(myField, myValue) {
    // if IE
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }

    // if MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == "0") {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;

        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } 
    
    else {
        myField.value += myValue;
    }
}

// corrects the caret poisition after pasting text
// works through the magic of Stack Overflow, don't ask how
function setCaretPosition(elem, caretPos) {
    if (elem != null) {
        if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.move("character", caretPos);
            range.select();
        }

        else {
            if (elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }

            else {
                elem.focus();
            }
        }
    }
}