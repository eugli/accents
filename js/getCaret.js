// stores the properties to be copied over from the text box to the mirror div
const properties = [
    "boxSizing",
    "width", 
    "height",
    "overflowX",
    "overflowY", 

    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",

    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",

    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "lineHeight",
    "fontFamily",

    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",

    "letterSpacing",
    "wordSpacing"
];

// stores the characters for shifting modal positions
const shiftDown = /([AEIOUSZNCHhGJS])/g
const shiftUpALot = /([?!])/g
const shiftUp = /(["'])/g

// stores the font size for modal position calculations
var fontSize;

// takes the focused element (the text box) and the index of the caret
// styles a mirror div with all of the same properties as the text box
// does some math
// returns the coordinates of the caret
function getCaret(element, position) {
    // creates the mirror div
    let mirrorDiv = document.getElementById(element.nodeName + "--mirror-div");
    if (!mirrorDiv) {
        mirrorDiv = document.createElement("div");
        mirrorDiv.id = element.nodeName + "--mirror-div";
        document.body.appendChild(mirrorDiv);
    }

    let style = mirrorDiv.style;
    let computed = getComputedStyle(element);
    // console.log('computed style: ', computed);

    style.whiteSpace = "pre-wrap";
    if (element.nodeName !== "INPUT")
        style.wordWrap = "break-word"; 

    // sets the position of the mirror div
    style.position = "absolute"; 
    style.top = $(':focus').offset().top + 'px'; 
    style.left = "400px";
    style.visibility = "hidden";

    // copies the styling from the text box
    properties.forEach(function (prop) {
        style[prop] = computed[prop];
    });

    // saves the font size of the text box to calculate modal position
    fontSize = computed["fontSize"];

    // ensures the text in the mirror div matches that of the text box
    mirrorDiv.textContent = element.value.substring(0, position);
    if (element.nodeName === "INPUT")
    mirrorDiv.textContent = mirrorDiv.textContent.replace(/\s/g, "\u00a0");

    let span = document.createElement("span");
    span.textContent = element.value.substring(position) || ".";
    span.style.backgroundColor = "lightgrey";
    mirrorDiv.appendChild(span);

    // calculates the coordinates of the caret
    let coordinates = {
        top: span.offsetTop + parseInt(computed["borderTopWidth"]),
        left: span.offsetLeft + parseInt(computed["borderLeftWidth"])
    };

    return coordinates;
}

// finalizes the calculations for the moda
function getKeyPosition(key) {
    activeelement = document.activeElement;

    let coordinates = getCaret(activeelement, activeelement.selectionEnd);
    let fontSize = getComputedStyle(activeelement).getPropertyValue("font-size");

    let top = $(':focus').offset().top 
            + coordinates.top 
            - 90;
    let left = $(':focus').offset().left
            + coordinates.left
            - 38.5
            - parseInt(fontSize, 10) / 3;

    // styles the modal appropriately (shifts up/down depending character pressed, flips modal if needed)
    styleModal(top, left, fontSize, key);
}

// finalizes the calculations for the modal in contenteditable 
function getKeyPositionContentEditable(textBox, key) {
    let coordinatesContent = getSelectionCoords(window);
    let fontSize = parseInt(document.queryCommandValue("FontSize"), 10) + 12;

    console.log(fontSize);
    console.log(coordinatesContent.top, coordinatesContent.left);

    let top = 
        + coordinatesContent.top 
        - 90;
    let left = 
        + coordinatesContent.left
        - 38.5
        - parseInt(fontSize, 10) / 3;

    // styles the modal appropriately (shifts up/down depending character pressed, flips modal if needed)
    styleModal(top, left, fontSize, key);
}

// return the coordinates of the carets
function getSelectionCoords(win) {
    win = win || window;
    var doc = win.document;
    var sel = doc.selection, range, rects, rect;
    var x = 0, y = 0;
    if (sel) {
        if (sel.type != "Control") {
            range = sel.createRange();
            range.collapse(true);
            x = range.boundingLeft;
            y = range.boundingTop;
        }
    } else if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0).cloneRange();
            if (range.getClientRects) {
                range.collapse(true);
                rects = range.getClientRects();
                if (rects.length > 0) {
                    rect = rects[0];
                }
                x = rect.left;
                y = rect.top;
            }

            if (x == 0 && y == 0) {
                var span = doc.createElement("span");
                if (span.getClientRects) {
                    span.appendChild( doc.createTextNode("\u200b") );
                    range.insertNode(span);
                    rect = span.getClientRects()[0];
                    x = rect.left;
                    y = rect.top;
                    var spanParent = span.parentNode;
                    spanParent.removeChild(span);
                    spanParent.normalize();
                }
            }
        }
    }

    let coordinatesContent = {
        top: y,
        left: x
    };

    return coordinatesContent;
}
