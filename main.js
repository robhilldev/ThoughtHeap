import { addRemoveButton, addEditButton, swapToSaveEditButton } from "./button.js";

let keys = Object.keys(localStorage);

// sort localstorage key array, populate page with notes, set up add note button
window.onload = function() {
  document.getElementById("text-to-add").value = "";

  keys.sort((a, b) => {
    if (Number(a) < Number(b)) { return -1; }
    if (Number(a) > Number(b)) { return 1; }
    return 0;
  });
  instantiateList(keys);

  let addButton = document.getElementById("form-button");
  addButton.addEventListener("click", addNote);
}

// create an instance of the list with notes from localstorage
function instantiateList(keys) {
  for (let key of keys) {
    let currentLi = document.createElement("li");
    let currentNote = localStorage.getItem(key);
    currentLi.innerHTML = "<div>" + currentNote + "</div>";
    currentLi.id = key;
    currentLi.appendChild(addEditButton(key)).addEventListener("click", editNote);
    currentLi.appendChild(addRemoveButton(key)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(currentLi);
  }
}

// add note to page, localstorage, and add key to array
function addNote() {
  event.preventDefault();
  let newLi = document.createElement("li");
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    let currentKey = String(
      Number(keys.length) === 0 ? 1 : Number(keys[keys.length - 1]) + 1
    );
    // add note to local storage and key array
    localStorage.setItem(currentKey, textToAdd.value);
    keys.push(currentKey);

    // add note to page with an id, edit button, and remove button
    newLi.innerHTML = "<div>" + textToAdd.value + "</div>";
    newLi.id = currentKey;
    newLi.appendChild(addEditButton(currentKey)).addEventListener("click", editNote);
    newLi.appendChild(addRemoveButton(currentKey)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(newLi);
    // clear input box
    textToAdd.value= "";
  }
}

// remove note from page, localstorage, and remove key from array
function removeNote(e) {
  let note = e.target.parentElement;
  localStorage.removeItem(note.id);
  keys = keys.filter((key) => key !== note.id);
  note.remove();
}

// open input box with existing content to allow editing of content
function editNote(e) {
  // store existing parent li, child text div, and text content
  let parentLi = e.target.parentElement;
  let childDiv = e.target.parentElement.firstElementChild;
  let currentText = e.target.parentElement.firstElementChild.textContent;

  // create and populate new input box for editing
  let editInputBox = document.createElement("input");
  editInputBox.value = currentText;

  // replace existing text div with editing input box
  parentLi.replaceChild(editInputBox, childDiv);
  editInputBox.focus();
  // swap to save edit button and store save edit, edit, and remove buttons
  let [saveEditButton, editButton, removeButton] = swapToSaveEditButton(parentLi.id);

  // pass event object and temporarily removed buttons to event handler
  saveEditButton.addEventListener("click", (event) => {
    let dataToPass = {"event": event, "args": [editButton, removeButton]};
    exitNoteEdit(dataToPass);
  });
  // allow pressing enter key within input box to trigger save edit button
  // or pressing escape key to cancel changes
  editInputBox.addEventListener("keyup", (event) => {
    event.preventDefault();
    if (event.key === "Enter") {
      document.getElementById(saveEditButton.id).click();
    } else if (event.key === "Escape") {
      let dataToPass = {"event": event, "args": [editButton, removeButton]};
      exitNoteEdit(dataToPass);
    }
  });
}

// handle saving of edited note to page and localstorage
function exitNoteEdit(dataToPass) {
  let editButton = dataToPass.args[0];
  let removeButton = dataToPass.args[1];

  // store existing parent li, child input box, text content, and button
  let parentLi = dataToPass.event.target.parentElement;
  let childInputBox = dataToPass.event.target.parentElement.firstElementChild;
  let edittedText = dataToPass.event.target.parentElement.firstElementChild.value;
  let saveEditButton = dataToPass.event.target.parentElement.lastElementChild;

  // create new div and populate with editted text content or old content
  let newTextDiv = document.createElement("div");
  if (event.target.className == "save-edit") {
    localStorage.setItem(parentLi.id, edittedText);
    newTextDiv.textContent = edittedText;
  } else {
    newTextDiv.textContent = localStorage.getItem(parentLi.id);
  }

  // swap input box for text div and save edit button for remove and edit buttons
  parentLi.replaceChild(newTextDiv, childInputBox);
  parentLi.removeChild(saveEditButton);
  parentLi.append(editButton, removeButton);
}