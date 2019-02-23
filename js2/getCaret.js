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

// takes the focused element (the text box) and the index of the caret
// styles a mirror div with all of the same properties as the text box
// does some math
// returns the coordinates of the caret
// works through the magic of Stack Overflow, don't ask how
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

// finalizes the calculations for the modal 1
// styles the modal appropriately (shifts up/down depending character pressed, flips modal if needed) 2
function getKeyPosition() {
    activeelement = document.activeElement;

    let coordinates = getCaret(activeelement, activeelement.selectionEnd);
    let fontSize = getComputedStyle(activeelement).getPropertyValue("font-size");

    // 1
    let top = $(':focus').offset().top 
            + coordinates.top 
            - 90;
    let left = $(':focus').offset().left
            + coordinates.left
            - 38.5
            - parseInt(fontSize, 10) / 3;

    // 2
    styleModal(top, left, fontSize);
}

// GOOGLE DOCS STUFF
// if ($('.kix-cursor.docs-ui-unprintable') != null) {
//     // this is google docs
//     activeelement = $('.kix-cursor.docs-ui-unprintable');
// }

// finalizes the calculations for the modal in contenteditable 1
// styles the modal appropriately (shifts up/down depending character pressed, flips modal if needed) 2
function getKeyPositionContentEditable() {
    activeelement = document.activeElement;

    let coordinatesContent = getSelectionCoords(window);
    let fontSize = getComputedStyle(activeelement).getPropertyValue("font-size");

    console.log(coordinatesContent.top, coordinatesContent.left);

    // 1
    let top = 
        + coordinatesContent.top 
        - 90;
    let left = 
        + coordinatesContent.left
        - 38.5
    - parseInt(fontSize, 10) / 3;

    // 2
    styleModal(top, left, fontSize);
}

// return the coordinates of the carets
// don't even think about asking how this works, Stack Overflow
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

// styles the modal for better positioning
function styleModal(top, left, fontSize) {
    // positions the modal for certain keys better
    if (key == "l" || key == "j" || key == "i" || key == "'") {
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