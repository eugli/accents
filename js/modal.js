const accentLetters = {
    "a": [
        "&#225", "&#224", "&#226", "&#228", "&#230", "&#229", "&#227", "&#257"
    ],
    "A": [
        "&#193", "&#192", "&#194", "&#196", "&#198", "&#197", "&#195", "&#256"
    ],
    "e": [
        "&#233", "&#232", "&#234", "&#235", "&#281", "&#275", "&#279"
    ],
    "E": [
        "&#201", "&#200", "&#202", "&#203", "&#280", "&#274", "&#278"
    ],
    "i": [
        "&#237", "&#236", "&#238", "&#239", "&#303", "&#299"
    ],
    "I": [
        "&#205", "&#204", "&#206", "&#207", "&#302", "&#298"
    ],
    "o": [
        "&#243", "&#242", "&#244", "&#246", "&#339", "&#248", "&#245", "&#333"
    ],
    "O": [
        "&#211", "&#210", "&#212", "&#214", "&#338", "&#216", "&#213", "&#332"
    ],
    "u": [
        "&#250", "&#249", "&#251", "&#252", "&#363"
    ],
    "U": [
        "&#218", "&Ugrave", "&#219", "&#220", "&#362"
    ],
    "s": [
        "&szlig", "&#347", "&#353"
    ],
    "S": [
        "&#346", "&#352"
    ],
    "l": [
        "&#322"
    ],
    "L": [
        "&#321"
    ],
    "z": [
        "&#378", "&#382", "&#380"
    ],
    "Z": [
        "&#377", "&#381", "&#379"
    ],
    "c": [
        "&ccedil", "&#263", "&#265"
    ],
    "C": [
        "&Ccedil", "&#262", "&#264"
    ],
    "n": [
        "&#241", "&#324"
    ],
    "N": [
        "&#209", " &#323"
    ],
    "!": [
        "&#161"
    ],
    "?": [
        "&#191"
    ],
    "\"": [
        "&laquo", "&raquo"
    ],
    "'": [
        "&#8249", "&#8250"
    ]
}

const HIDE_MODAL_TIMEOUT = 25;
let modalNumbers = [];


function show(letter) {
    __setup(letter);
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

    let element =
        `<div class="modal-popupAccents" id="modal-popupAccents">
        ${columns}
    </div>\n`;

    $("body").append(element);
}

function hide() {
    modalPoppedUp = false;
    $('.modal-popupAccents').remove();
}

// funtion should only run when the modal is popped up
// detects any event on the key
function detectEvent() {

    // keyboard shortcuts
    $(window).on('keydown', async (event) => {

        // if it is a valid number
        if (modalNumbers.indexOf(parseInt(event.key)) > -1) {
            event.preventDefault();

            let id = String.fromCharCode(event.which);
            let button = document.getElementById(id);
            getText(button);

            executeAccent();

            $("#" + id).css("background-color", "#e4f1ff");

            $(".columnAccents").unbind("click");
            $(activeelement).unbind("click keydown");
            $(window).unbind("resize mousedown blur contextmenu");

        }

        // removes the modal and reverts the color change
        setTimeout(() => {
            $(".modal-popupAccents").remove();
            $("#" + id).css("background-color", "transparent");

            hide();
        }, HIDE_MODAL_TIMEOUT);
    });

    // clicking a button
    $('.buttonClassAccents').one('click', event => {
        console.log(event);

        let element = $(event.currentTarget);

        getText(element);

        // executes the placement of the character
        executeAccent();

        // unbinds the possible events
        $(".columnAccents").unbind("click");
        $(activeelement).unbind("click keydown");
        $(window).unbind("resize click blur contextmenu");

        // removes the modal and reverts the color change 
        // from the :active selector on the button clicked
        setTimeout(() => {
            $(".modal-popupAccents").remove();

            hide();
        }, HIDE_MODAL_TIMEOUT);
    });
}