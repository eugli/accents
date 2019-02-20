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

    // logs the coordinates before adjusting calculations for the modal
    // console.log("coordinates BEFORE: " + coordinates.left + ", " + coordinates.top);

    return coordinates;
}

// finalizes the calculations for the caret
// styles the modal appropriately (shifts up/down depending character pressed, flips modal if needed)
function getKeyPosition() {
    activeelement = document.activeElement;

    // GOOGLE DOCS STUFF
    // if ($('.kix-cursor.docs-ui-unprintable') != null) {
    //     // this is google docs
    //     activeelement = $('.kix-cursor.docs-ui-unprintable');
    // }

    // console.log('active element: ', activeelement.className);

    let coordinates = getCaret(activeelement, activeelement.selectionEnd);
    let fontSize = getComputedStyle(activeelement).getPropertyValue("font-size");

    // calculates the modal coordinates
    let top = $(':focus').offset().top 
            + coordinates.top 
            - 90;
    let left = $(':focus').offset().left
            + coordinates.left
            - 38.5
            - parseInt(fontSize, 10) / 3;

    console.log(key)

    // positions the modal for certain keys better
    if (key == "l" || key == "i" || key == "'") {
        left += parseInt(fontSize, 10) / 5;
    }

    if (key == '"') {
        left += parseInt(fontSize, 10) / 10;
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