const shiftDown = /([AEIOUSZNC])/g
const shiftUpALot = /([?!])/g
const shiftUp = /(["'])/g
var inputs = ['input', 'select', 'button', 'textarea'];
var poppedUp = false;
var interval;
var key;
var numbers;
var textToBePasted = "default";
var clipboardSaved;
var activeelement;
var lastFocus;
var fontSize;
var properties = [
    'boxSizing',
    'width', 
    'height',
    'overflowX',
    'overflowY', 

    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',

    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',

    'fontStyle',
    'fontVariant',
    'fontWeight',
    'fontStretch',
    'fontSize',
    'lineHeight',
    'fontFamily',

    'textAlign',
    'textTransform',
    'textIndent',
    'textDecoration',

    'letterSpacing',
    'wordSpacing'
];

var mirrorDiv, computed, style;

// to possibly do later: 
// allow user to select accent while holding down key (something to do with that eventandkeyhandler is only called on key up),
// but not that it has to be there to only register the event handler once
// customization of keys, w/e characters and emojis desired (would be update after succesful publish)
// NEED SPECIAL CARET COORDINATE GETTERS FOR CONTENTEDITABLE
// GOOGLE DOCS IS A PAIN

// tomorrow's goals:
// get proper caret positioning
// prevent input triggering twice
// clean up code
// keydown to work while held
// bigger on google????

getCaretCoordinates = function (element, position) {
    mirrorDiv = document.getElementById(element.nodeName + '--mirror-div');
    if (!mirrorDiv) {
        mirrorDiv = document.createElement('div');
        mirrorDiv.id = element.nodeName + '--mirror-div';
        document.body.appendChild(mirrorDiv);
    }

    style = mirrorDiv.style;
    computed = getComputedStyle(element);

    style.whiteSpace = 'pre-wrap';
    if (element.nodeName !== 'INPUT')
        style.wordWrap = 'break-word'; 

    style.position = 'absolute'; 
    style.top = element.offsetTop + parseInt(computed.borderTopWidth) + 'px';
    style.left = "400px";
    style.visibility = "hidden";

    properties.forEach(function (prop) {
        style[prop] = computed[prop];
    });

    fontSize = computed["fontSize"];

    mirrorDiv.textContent = element.value.substring(0, position);
    if (element.nodeName === 'INPUT')
    mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, "\u00a0");

    var span = document.createElement('span');
    span.textContent = element.value.substring(position) || '.';
    span.style.backgroundColor = "lightgrey";
    mirrorDiv.appendChild(span);

    var coordinates = {
        top: span.offsetTop + parseInt(computed['borderTopWidth']),
        left: span.offsetLeft + parseInt(computed['borderLeftWidth'])
    };

    return coordinates;
}

$(window).ready(function () {
    preventInfinity();
    checkForModal();
    preventBlur();
});

function preventBlur() {
    $(activeelement).blur(function() {
        lastFocus = this;
    });
}

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

function checkForModal() {
    $(window).on("keypress", function(e) {
        if(key != e.key && e.keyCode != 16 && interval == null) {
            key = e.key;
            interval = setTimeout(function() {
                if (accentLetters[key] != undefined && document.activeElement && inputs.indexOf(document.activeElement.tagName.toLowerCase()) !== -1) {
                    activeelement = document.activeElement;
                    lastFocus = activeelement;
                    console.log("modal");
                    generateModal(accentLetters[key]);
                    getKeyPosition();

                    poppedUp = true;
                }
            }, 250);
        }
    }).on("keyup", function(e) {
        if (e.keyCode != 16) {
            clearInterval(interval); 
            key = "";
            interval = null;

            if (poppedUp)
            {
                clickAndKeyHandler();
            }
        }
    });
}

function generateModal(object) {
    if (!poppedUp) {
        // deletes old modal
        $(".modal-popupAccents").remove();

        // creates new modal
        let columns = "";

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
            
            numbers = iterator;
        });

        let element = 
        `<div class="modal-popupAccents" id="modal-popupAccents">
            ${columns}
        </div>\n`;
        
        $('body').append(element);
    }
}

function getKeyPosition() {
    activeelement = document.activeElement;
    var coordinates = getCaretCoordinates(activeelement, activeelement.selectionEnd);
    console.log('(top, left) = (%s, %s)', coordinates.top, coordinates.left);
    var fontSize = getComputedStyle(activeelement).getPropertyValue('font-size');

    var rect = document.createElement('div');
    document.body.appendChild(rect);
    rect.style.position = 'absolute';
    rect.style.backgroundColor = 'red';
    rect.style.height = fontSize;
    rect.style.width = '1px';

    rect.style.top = activeelement.offsetTop
        - activeelement.scrollTop
        + coordinates.top
        + 'px';
    rect.style.left = activeelement.offsetLeft
        - activeelement.scrollLeft
        + coordinates.left
        + 'px';
    console.log($(":focus").position())

    let top = activeelement.offsetTop
        - activeelement.scrollTop
        + coordinates.top
        // + $(":focus").position().top
        - 91.5
        + 'px';

    let left = activeelement.offsetLeft
        - activeelement.scrollLeft
        + coordinates.left
        // + $(":focus").position().top
        - parseInt(fontSize, 10) / 3
        - 38.5
        + 'px';

    shiftDown.lastIndex = 0; // resets regex index b/c regex is a bitch
    if (shiftDown.test(key)) {
        $(".topAccents").css({
            "margin-top": "5.25px"
        });
        
        $(".buttonClassAccents").css({
            "height": "58px"
        });

        $(".modal-popupAccents").css({
            "height": "64px",
        });

        $(".modal-popupAccents").toggleClass("changed");
        $(".topAccents").toggleClass("changed");

        $(".bottomAccents").css({
            "margin-top": "-19px"
        });
    }

    shiftUp.lastIndex = 0;
    if (shiftUp.test(key)) {
        $(".topAccents").css({
            "margin-top": "-1px"
        });

        $(".bottomAccents").css({
            "margin-top": "-18px"
        });
    }

    shiftUpALot.lastIndex = 0;
    if (shiftUpALot.test(key)) {
        $(".topAccents").css({
            "margin-top": "-3.5px"
        });

        $(".bottomAccents").css({
            "margin-top": "-12px"
        });
    }

    if (parseInt(top, 10) < -5) {
        shiftDown.lastIndex = 0;
        
        if (shiftDown.test(key)) {
            $(".modal-popupAccents").toggleClass("changedFlipped");
            $(".modal-popupAccents").css({
                "left": left,
                "top": parseInt(top, 10) + parseInt(fontSize, 10) +  87.5 +  "px"
            });
        }

        else {
            $(".modal-popupAccents").toggleClass("flipped");
            $(".modal-popupAccents").css({
                "left": left,
                "top": parseInt(top, 10) + parseInt(fontSize, 10) +  87.5 +  "px"
            });
        }
    }

    else {
        $("#modal-popupAccents").css({
            "left": left,
            "top": top
        });
    }
}

function clickAndKeyHandler() {
    $(".columnAccents").one("click", async function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (lastFocus) {
            setTimeout(function() {lastFocus.focus()}, 1);
        }

        let id = $(this).children(".buttonClassAccents").attr("id");

        if (poppedUp) {
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

        $(activeelement).unbind("click keydown");
        $(window).unbind("resize click blur");

        setTimeout(function() {
            $(".modal-popupAccents").remove(); // delete modal
            $("#" + id).css("background-color", "transparent");
            poppedUp = false;
        }, 25);     
    });
    
    $(window).one("click resize", function(e) {
        $(".columnAccents").unbind("click");
        $(activeelement).unbind("keydown click");

        setTimeout(function() {
            $(".modal-popupAccents").remove(); // delete modal
            poppedUp = false;
        }, 1);
    });

    $(activeelement).one("click", function(e) {
        $(".columnAccents").unbind("click");
        $(window).unbind("resize click blur");
        $(activeelement).unbind("keydown");

        setTimeout(function() {
            $(".modal-popupAccents").remove(); // delete modal
            poppedUp = false;
        }, 1);
    });

    $(activeelement).one("keydown", async function(e) {
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

            setTimeout(function() {
                $(".modal-popupAccents").remove(); // delete modal
                $("#" + id).css("background-color", "transparent");
                poppedUp = false;
            }, 25); 
        }

        else {
            setTimeout(function() {
                $(".modal-popupAccents").remove(); // delete modal
                poppedUp = false;
            }, 1);
        }
    });
}

function getText(element) {
    let letter = $(element).find(".topAccents").text();
    let number = $(element).find(".bottomAccents").text();
    console.log(letter, number);

    textToBePasted = letter;
}

function copyToClipboard (textToBePasted) {
    const el = document.createElement('textarea'); 
    el.value = textToBePasted;                                 
    el.setAttribute('readonly', '');                
    el.style.position = 'absolute';                 
    el.style.left = '-9999px';                 
    document.body.appendChild(el);                 
    const selected =            
      document.getSelection().rangeCount > 0      
        ? document.getSelection().getRangeAt(0)    
        : false;                                 
    el.select();                                
    document.execCommand('copy');                  
    document.body.removeChild(el);                 
    if (selected) {                                 
      document.getSelection().removeAllRanges();   
      document.getSelection().addRange(selected);
    }   
}

function insertAtCursor(myField, myValue) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        myField.selectionStart = startPos + myValue.length;
        myField.selectionEnd = startPos + myValue.length;
    } else {
        myField.value += myValue;
    }
}

function setCaretPosition(elem, caretPos) {
    if(elem != null) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.data) {
        clipboardSaved = request.data;
        console.log(clipboardSaved);
    }
});