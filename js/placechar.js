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

// works through the magic of Stack Overflow, don't ask how
function copyToClipboard(textToBePasted) {
  console.log('copyToClipboard: ', textToBePasted);
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

function getText(element) {
  let letter = $(element).find(".topAccents").text();
  let number = $(element).find(".bottomAccents").text();

  // stores the character as the text to be pasted
  textToBePasted = letter;
}

// inserts the text to the desired caret position
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