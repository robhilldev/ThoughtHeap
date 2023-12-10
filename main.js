import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";

let titles = Object.keys(localStorage);
let currentTitle = titles.find(t => t.endsWith("_current")) || "0_My Notes_current";
let userFacingTitle = currentTitle
  .substring(currentTitle.indexOf("_") + 1, currentTitle.lastIndexOf("_"));
let currentList = JSON.parse(localStorage.getItem(currentTitle)) || [];
// let titleKeys = [];
let noteKeys = [];

// add current title to page, clear input box, set up buttons, display notes
window.onload = function() {
  document.getElementsByTagName("h1")[0].textContent = currentTitle.split("_")[1];
  document.getElementsByTagName("h1")[0].id = `title-${currentTitle.split("_")[0]}`;
  document.getElementById("text-to-add").value = "";
  document.getElementById("edit-button-header").addEventListener("click", editText);
  document.getElementById("form-button").addEventListener("click", addNote);

  initializeCurrentList(currentList);
}

// retrieve the current list from localstorage and display it on the page
function initializeCurrentList(list) {
  // also update title key from current title
  // titleKeys.push();
  for (let i = 0; i < currentList.length; i++) {
    // also update keys for this list of notes
    noteKeys.push(String(i));
    // show only notes not marked for deletion
    if (!currentList[i].startsWith("x_", 0) && !currentList[i].endsWith("_x")) {
      let currentLi = document.createElement("li");
      currentLi.innerHTML = "<div>" + currentList[i] + "</div>";
      currentLi.id = i;
      currentLi.appendChild(addEditButton(i)).addEventListener("click", editText);
      currentLi.appendChild(addRemoveButton(i)).addEventListener("click", removeNote);
      document.getElementById("list").appendChild(currentLi);
    }
  }
}

// function addList() {}

// add note to page and localstorage, add key to array
function addNote() {
  event.preventDefault();
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    // create li element for housing new note and create key
    let newLi = document.createElement("li");
    let newId = String(
      Number(noteKeys.length) === 0 ? 0 : Number(noteKeys[noteKeys.length - 1]) + 1
    );

    // add note to list array and local storage, add note key to key array
    currentList.push(textToAdd.value);
    localStorage.setItem(currentTitle, JSON.stringify(currentList));
    noteKeys.push(newId);

    // add note to page with an id, edit button, and remove button
    newLi.innerHTML = "<div>" + textToAdd.value + "</div>";
    newLi.id = newId;
    newLi.appendChild(addEditButton(newId)).addEventListener("click", editText);
    newLi.appendChild(addRemoveButton(newId)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(newLi);

    // clear input box
    textToAdd.value = "";
  }
}

// remove note from page and mark note for deletion in localstorage
function removeNote(e) {
  let note = e.target.parentElement;
  note.remove();
  currentList.splice(note.id, 1, `x_${note.firstElementChild.textContent}_x`);
  localStorage.setItem(currentTitle, JSON.stringify(currentList));
}

// function removeList(e) {}

// function emptyTrash(e) {}
// note: will need to realign keys on emptying of trash

// open input box with existing content to allow editing of content
function editText(e) {
  // store existing parent element, text element, and text content
  let parent = e.target.parentElement;
  let firstChild = parent.firstElementChild;
  let currentText = parent.firstElementChild.textContent;

  // create and populate new input box for editing
  let editInputBox = document.createElement("span");
  editInputBox.id = "edit-input-box";
  editInputBox.role = "textbox";
  editInputBox.contentEditable = true;
  editInputBox.innerText = currentText;

  // replace existing text element with editing input box
  parent.replaceChild(editInputBox, firstChild);
  editInputBox.focus();
  // place text cursor at end of input box (span)
  document.getSelection().collapse(editInputBox, 1);

  // swap to save edit and discard edit buttons, store save edit, edit, and remove buttons
  let [discardEditButton, saveEditButton, editButton, removeButton] = swapToEditButtons(parent.id);

  // pass event object and temporarily removed buttons to event handler on click
  discardEditButton.addEventListener("click", (event) => {
    let dataToPass = {"e": event, "args": [editButton, removeButton]};
    exitTextEdit(dataToPass);
  });
  saveEditButton.addEventListener("click", (event) => {
    let dataToPass = {"e": event, "args": [editButton, removeButton]};
    exitTextEdit(dataToPass);
  });
  
  // within input box, make enter trigger save edit and escape trigger discard edit
  editInputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(saveEditButton.id).click();
    } else if (event.key === "Escape") {
      document.getElementById(discardEditButton.id).click();
    }
  });
}

// handle saving of edited content to page and localstorage, or discarding edit
function exitTextEdit(dataToPass) {
  let editButton = dataToPass.args[0];
  let removeButton = dataToPass.args[1];

  // store existing parent element, child input box, text content, and buttons
  let parent = dataToPass.e.target.parentElement;
  let childInputBox = parent.firstElementChild;
  let edittedText = parent.firstElementChild.innerText;
  let discardEditButton = parent.lastElementChild;
  let saveEditButton = parent.lastElementChild.previousElementSibling;

  // create new text element, populate with editted text or old text
  if (parent.tagName === "LI") {
    // on note edit
    let newTextElement = document.createElement("div");
    if (dataToPass.e.target.className == "save-edit") {
      // update list array and localstorage, populate new text element
      currentList.splice(parent.id, 1, edittedText);
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      newTextElement.textContent = edittedText;
    } else {
      // put back existing text
      newTextElement.textContent = currentList[parent.id];
    }
    // swap in updated text element, edit button, and remove button
    parent.replaceChild(newTextElement, childInputBox);
    parent.replaceChild(editButton, saveEditButton);
    parent.replaceChild(removeButton, discardEditButton);
  } else if (parent.tagName === "HEADER") {
    // on title edit
    let newTextElement = document.createElement("h1");
    if (dataToPass.e.target.className == "save-edit") {
      // update title array and localstorage, populate new text element
      let previousTitle = currentTitle;
      let titleKey = currentTitle.substring(0, currentTitle.indexOf("_"));
      currentTitle = `${titleKey}_${edittedText}_current`;
      titles.splice(titleKey, 1, currentTitle);
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      localStorage.removeItem(previousTitle);
      newTextElement.textContent = edittedText;
    } else {
      // put back existing text
      newTextElement.textContent = currentTitle.split("_")[1];
    }
    // swap in updated text element and edit button, remove discard button
    parent.replaceChild(newTextElement, childInputBox);
    parent.replaceChild(editButton, saveEditButton);
    parent.removeChild(discardEditButton);
  }
}