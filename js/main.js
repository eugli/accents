// to possibly do later: 
// customization of keys, w/e characters and emojis desired

// to do:
// CONTENTEDITABLE KMS 
// GOOGLE DOCS KMS AGAIN 

// issues:
// get proper caret positioning MAJOR
// keydown to work while held (means event key handlers have to happen on keydown, not keyup) ***MAJOR***
// different sizes on different webpages (compare google and discord)???? MINOR

// notes:
// first publish after all current issues are resolved (w/o functionality for Google Docs and contenteditable)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

// stores the pre-modal clipboard data
var clipboardSaved;

// stores the focused element
var activeelement;

// stores the previously focused element (the text box)
var lastFocus;

// stores the font size for modal position calculations
var fontSize;

// saves the pre-modal clipboard data upon receiving the message from the background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data) {
        clipboardSaved = request.data;
        // console.log(clipboardSaved);
    }
});

$(window).ready(function () {
    preventInfinity();
    checkForModal();
    preventBlur();
    // onGoogleDocs();
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

// TODO fix this lol
function onGoogleDocs() {
    let iframe = document.getElementsByTagName("iframe")[0];
    if (iframe) {
        iframe.contentDocument.addEventListener("keypress", function(evt) {
            // in here call our even functions
            console.log('clicky boi: ', evt);
        }, false)
    }
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
                    // console.log("modal successful");

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
    // handles a click on a modal button by executing the character
    $(".columnAccents").one("click", async function(e) {
        // helps with preventing the click from doing other things (I think)
        e.preventDefault();
        e.stopPropagation();

        // refocuses the text box if needed
        if (lastFocus) {
            setTimeout(function() {lastFocus.focus()}, 1);
        }

        // gets the text to be pasted from the activated button 
        let id = $(this).children(".buttonClassAccents").attr("id");
        getText(this);

        // if the modal is popped up
        // executes the placement of the character
        if (poppedUp) {
            executeAccent();
        }

        // unbinds the possible events
        $(".columnAccents").unbind("click");
        $(activeelement).unbind("click keydown");
        $(window).unbind("resize click blur contextmenu");

        // removes the modal and reverts the color change from the :active selector
        setTimeout(function() {
            $(".modal-popupAccents").remove();
            $("#" + id).css("background-color", "transparent");

            // stores that the modal is no longer popped up
            poppedUp = false;
        }, 25);     
    });

    // handles a keypress
    $(activeelement).one("keydown", async function(e) {
        // if the key is in the numbers on the modal
        // remove the modal with executing the character
        if (numbers != null && e.keyCode >= 49 && e.keyCode <= 49 + numbers) {
            // helps with preventing the click from doing other things (I think)
            e.preventDefault();
            e.stopPropagation();

            // refocuses the text box if needed
            if (lastFocus) {
                setTimeout(function() {lastFocus.focus()}, 1);
            }

            // gets the text to be pasted from the activated button 
            let id = String.fromCharCode(e.which);
            let button = document.getElementById(id);
            getText(button);

            // if the modal is popped up
            // executes the placement of the character
            if (poppedUp) {
                executeAccent();
            }
            
            // changes button background color
            $("#" + id).css("background-color", "#e4f1ff");

            // unbinds the possible events
            $(".columnAccents").unbind("click");
            $(activeelement).unbind("click keydown");
            $(window).unbind("resize mousedown blur contextmenu");

           // removes the modal and reverts the color change
            setTimeout(function() {
                $(".modal-popupAccents").remove();
                $("#" + id).css("background-color", "transparent");

                // stores that the modal is no longer popped up
                poppedUp = false;
            }, 25); 
        }

        // if the key is not in the number set
        // remove the modal without executing the character
        else {
            setTimeout(function() {
                $(".modal-popupAccents").remove(); 

                // stores that the modal is no longer popped up
                poppedUp = false;
            }, 1);
        }
    });

    // handles a resize, blur, or right click (contxt menu) on the window by removing the modal without executing the character
    $(window).one("resize blur contextmenu", function(e) {
            // unbinds the possible events
            $(".columnAccents").unbind("click");
            $(activeelement).unbind("click keydown");
            $(window).unbind("resize mousedown blur contextmenu");

            // removes the modal
            setTimeout(function() {
                $(".modal-popupAccents").remove();

                // stores that the modal is no longer popped up
                poppedUp = false;
            }, 1);
    });

    // handles a mouse down action by removing the modal without executing the character
    // separate to preserve the click action for the modal, but the mouse down action for anywhere else
    $(window).one("mousedown", function(e) {
        // if the target is not the modal
        if (e.target.getAttribute("class") !== "buttonClassAccents" && e.target.getAttribute("class") !== "topAccents"
            && e.target.getAttribute("class") !== "bottomAccents") {
            // unbinds the possible events
            $(".columnAccents").unbind("click");
            $(activeelement).unbind("click keydown");
            $(window).unbind("resize mousedown blur contextmenu");

            // removes the modal
            setTimeout(function() {
                $(".modal-popupAccents").remove();

                // stores that the modal is no longer popped up
                poppedUp = false;
            }, 1);
        }
    });

    // handles a click on the text box that is not on the modal by removing the modal without executing the character
    $(activeelement).one("click", function(e) {
        // unbinds the possible events
        $(".columnAccents").unbind("click");
        $(activeelement).unbind("click keydown");
        $(window).unbind("resize mousedown blur contextmenu");

        // removes the modal
        setTimeout(function() {
            $(".modal-popupAccents").remove();

            // stores that the modal is no longer popped up
            poppedUp = false;
        }, 1);
    });
}

// executes the placement of the character
async function executeAccent() {
    // stores where the character will be placed (the caret position)
    var selectionEnd = lastFocus.selectionEnd;

    // logs the character to be placed
    // console.log("character to be placed: " + textToBePasted);

    // copies the character to the clipboard
    await copyToClipboard(textToBePasted);

    // ensures focus on the text box
    lastFocus.focus();

    // places the character at the caret position
    await insertAtCursor(lastFocus, textToBePasted)

    // removes the character typed from generating the modal
    await $(activeelement).val(
                function(index, value){
                return value.substr(0, selectionEnd - 1) + value.substr(selectionEnd);
            })
    
    // alternative to insertAtCursor but only places the character at the end of the text box
    // await document.execCommand("paste");

    // resets the original caret position from before the character placement
    await setCaretPosition(lastFocus, selectionEnd);

    // recopies pre-modal clipboard data to preserve it
    await copyToClipboard(clipboardSaved);
}

// gets the text to be pasted from the activated button 
function getText(element) {
    let letter = $(element).find(".topAccents").text();
    let number = $(element).find(".bottomAccents").text();

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