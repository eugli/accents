async function executeAccent(textToBePasted) {
  if (textBox.isContentEditable) {
    // copies the character to the clipboard
    await copyToClipboard(textToBePasted);

    var text = textBox.innerText;
    if (text[text.length - 1] === "\n") {
        text = text.slice(0, -1);
    }

    // await $(textBox).text(function (_, text) {
    //   return text.slice(0, -1);
    // });

    // places the character at the caret position
    await document.execCommand("paste");

    // recopies pre-modal clipboard data to preserve it
    await copyToClipboard(clipboardSaved);

    // ensures focus on the text box
    textBox.focus();
  }

  else {
    // stores where the character will be placed (the caret position)
    var selectionEnd = textBox.selectionEnd;

    // copies the character to the clipboard
    await copyToClipboard(textToBePasted);

    // places the character at the caret position
    await insertAtCursor(textBox, textToBePasted);

    // removes the character typed from generating the modal
    await $(textBox).val(
                function(index, value){
                return value.substr(0, selectionEnd - 1) + value.substr(selectionEnd);
            });

    // resets the original caret position from before the character placement
    await setCaretPosition(textBox, selectionEnd);

    // recopies pre-modal clipboard data to preserve it
    await copyToClipboard(clipboardSaved);

    // ensures focus on the text box
    textBox.focus();
  }
}

// copies the text to the clipboard
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

// gets the text to be pasted from the activated button 
function getText(element) {
  let letter = $(element).find(".topAccents").text();
  let number = $(element).find(".bottomAccents").text();

  return letter;
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

// deletes the old character for content editable text boxes
function replaceSelectedTextContentEditable(replacementText) {
  var sel, range;
  if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
          range = sel.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(replacementText));
      }
  } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      range.text = replacementText;
  }
}