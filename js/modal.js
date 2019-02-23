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
        "!", "¡"
    ],
    "?": [
        "¿"
    ],
    "\"": [
        "«", "»"
    ],
    "'": [
        "‹", "›"
    ]
}

const HIDE_MODAL_TIMEOUT = 25;
let modalNumbers = [];
let modalKeyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57];
let currentKeyCodes;


function show(letterSet, isShortcut) {
    if(isShortcut) {
        if(letterSet == undefined) {
            hide(textBox);
            return;
        }
        textToBePasted = letterSet;
        console.log('textToBePasted', textToBePasted);
        executeAccent()
    } else {
        __setup(letterSet);   
    }
}

function __setup(letter) {
    let columns = '';

    letter.forEach((element, iterator) => {

        columns +=
            `<div class="columnAccents">
        <button class="buttonClassAccents" type="button" id=${iterator + 1} >
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
    console.log('modalKeyCodes: ', currentKeyCodes);

    let element =
        `<div class="modal-popupAccents" id="modal-popupAccents">
        ${columns}
    </div>\n`;

    $("body").append(element);
    modalPoppedUp = true;
}

function hide(ae) {
    modalPoppedUp = false;
    $('.modal-popupAccents').remove();

    // change focus back to textbox
    ae.focus();
}