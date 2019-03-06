// stores all the accented characters and foreign symbols
const accentLetters = {
    "a": [
        "á", "à", "â", "ä", "æ", "å", "ã", "ā"
    ],
    "A": [
        "Á", "À", "Â", "Ä", "Æ", "Å", "Ã", "Ā"
    ],
    "e": [
        "é", "è", "ê", "ë", "ę", "ē", "ė"
    ],
    "E": [
        "É", "È", "Ê", "Ë", "Ę", "Ē", "Ė"
    ],
    "i": [
        "í", "ì", "î", "ï", "į", "ī"
    ],
    "I": [
        "Í", "Ì", "Î", "Ï", "Į", "Ī"
    ],
    "o": [
        "ó", "ò", "ô", "ö", "ő", "œ", "ø", "õ", "ō"
    ],
    "O": [
        "Ó", "Ò", "Ô", "Ö", "Ő", "Œ", "Ø", "Õ", "Ō"
    ],
    "u": [
        "ú", "ù", "û", "ŭ", "ü", "ű", "ū" 
    ],
    "U": [
        "Ú", "Ù", "Û", "Ŭ", "Ü", "Ű", "Ū" 
    ],
    "s": [
        "ß", "ś", "š", "ŝ"
    ],
    "S": [
        "Ś", "Š", "Ŝ"
    ],
    "l": [
        "ł"
    ],
    "L": [
        "Ł"
    ],
    "z": [
        "ź", "ž", "ż"
    ],
    "Z": [
        "Ź", "Ž", "Ż"
    ],
    "c": [
        "ç", "ć", "ĉ"
    ],
    "C": [
        "Ç", "Ć", "Ĉ"
    ],
    "n": [
        "ñ", "ń"
    ],
    "N": [
        "Ñ", "Ń"
    ],
    "g": [
        "ĝ"
    ],
    "G": [
        "Ĝ"
    ],
    "h": [
        "ĥ"
    ],
    "H": [
        "Ĥ"
    ],
    "j": [
        "ĵ"
    ],
    "J": [
        "Ĵ"
    ],
    "!": [
        "¡"
    ],
    "?": [
        "¿"
    ],
    "$": [
        "€", "£"
    ],
    "\"": [
        "«", "»"
    ],
    "'": [
        "‹", "›"
    ]
}

// stores the characters for shifting modal positions
const shiftDown = /([AEIOUSZNCHhGJS])/g
const shiftUpALot = /([?!])/g
const shiftUp = /(["'])/g

const HIDE_MODAL_TIMEOUT = 50;
const modalKeyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57];

// stores the possible numbers you can press
let modalNumbers = [];

// stores a truncated modalKeyCodes that represents the possilbe numbers you can press
let currentKeyCodes;

// takes in the array of possible accents (if !shortcut) / the single character to be pasted (if shortcut)
function show(letterSet, isShortcut) {
    // if shortcut, executes the accent
    if (isShortcut) {
        if (letterSet == undefined) {
            hide(textBox);
            return;
        }
        
        textToBePasted = letterSet;
        executeAccent(textToBePasted);
    } 
    
    // if not, sets up the modal
    else {
        setupModal(letterSet);  
        console.log("modal") 
    }
}

// injects the HTML into the web page to generate the modal with the given JSON object
function setupModal(letter) {
    let columns = "";

    letter.forEach((element, iterator) => {
        // creates the new modal HTML
        columns +=
        `<div class="columnAccents">
            <button class="buttonClassAccents" type="button" id=button${iterator + 1}>
                <span class="spanSpecialAccents">
                    <h3 class="topAccents">${element}</h3>
                    <h2 class="bottomAccents">${iterator + 1}</h2>
                </span>
            </button>
        </div>\n`;

        // stores the numbers that can be pressed on the modal
        modalNumbers.push(iterator + 1);
    });

    currentKeyCodes = modalKeyCodes.slice(0, letter.length);

    let element = 
    `<div class="modal-popupAccents" id="modal-popupAccents" style:">
        ${columns}
    </div>\n`;

    // appends the HTML
    $("body").append(element);

    // stores that the modal has been popped up
    modalPoppedUp = true;
}

// styles the modal for better positioning
function styleModal(top, left, fontSize, key) {
    // positions the modal for certain keys better
    if (key == "l" || key == "j" || key == "i" || key == "'" || key == "!") {
        left += parseInt(fontSize, 10) / 5;
    }

    if (key == '"') {
        left += parseInt(fontSize, 10) / 10;
    }

    if (key == "g") {
        $(".bottomAccents").css({
            "margin-top": "-16px"
        });
    }

    // resets regex index
    // shifts characters down slightly for capital letters
    // makes a larger modal
    shiftDown.lastIndex = 0;
    if (shiftDown.test(key)) {
        $(".topAccents").css({
            "margin-top": "5.25px"
        });
        
        $(".buttonClassAccents").css({
            "height": "58px"
        });

        $(".modal-popupAccents").css({
            "height": "67px",
        });

        $(".modal-popupAccents").toggleClass("changed");
        $(".topAccents").toggleClass("changed");

        $(".bottomAccents").css({
            "margin-top": "-19px"
        });
    }

    // resets regex index
    // shifts characters up slightly for guillemets
    shiftUp.lastIndex = 0;
    if (shiftUp.test(key)) {
        $(".topAccents").css({
            "margin-top": "-2px"
        });

        $(".bottomAccents").css({
            "margin-top": "-16px"
        });
    }

    // resets regex index
    // shifts characters up a lot for inverted exclamation and question mark
    shiftUpALot.lastIndex = 0;
    if (shiftUpALot.test(key)) {
        $(".topAccents").css({
            "margin-top": "-3.5px"
        });

        $(".bottomAccents").css({
            "margin-top": "-12px"
        });
    }

    // sets the modal coordinates
    // flips the modal and places it beneath the text if the position would otherwise be off-screen
    if (parseInt(top, 10) - $(window).scrollTop() < -5) {
        shiftDown.lastIndex = 0;
        
        console.log(key)
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
                "left": parseInt(left, 10) + 1 + "px",
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

// deletes the modal
function hide(ae) {
    modalPoppedUp = false;
    $('.modal-popupAccents').remove();

    // unbinds possible events
    unbindEvents();

    // changes focus back to textbox
    ae.focus();
}