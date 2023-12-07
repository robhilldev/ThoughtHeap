import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";

let listTitles = Object.keys(localStorage);
let lists = Object.values(localStorage);
// VVV this should determine the "_current" list eventually instead of first title VVV
let currentListTitle = listTitles.length > 0 ? listTitles[0] : "1_My Notes_current";
// VVV this should determine the current list eventually instead of first list VVV
let currentList = lists.length > 0 ? JSON.parse(lists[0]) : [];
let noteKeys = [];

// add current title to page, clear input box, set up add note button, display notes
window.onload = function() {
  document.getElementsByTagName("h1")[0].textContent = currentListTitle.split("_")[1];
  document.getElementById("text-to-add").value = "";

  let addButton = document.getElementById("form-button");
  addButton.addEventListener("click", addNote);

  // keys.sort((a, b) => {
  //   if (Number(a) < Number(b)) { return -1; }
  //   if (Number(a) > Number(b)) { return 1; }
  //   return 0;
  // });
  // initializeCurrentList(keys);
  initializeCurrentList(currentList);
}

// retrieve the current list from localstorage and display it on the page
function initializeCurrentList(list) {
  for (let i = 0; i < currentList.length; i++) {
    // also update keys for this list of notes
    noteKeys.push(String(i));
    let currentLi = document.createElement("li");
    currentLi.innerHTML = "<div>" + currentList[i] + "</div>";
    currentLi.id = i;
    currentLi.appendChild(addEditButton(i)).addEventListener("click", editNote);
    currentLi.appendChild(addRemoveButton(i)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(currentLi);
  }
  console.log(noteKeys);
}

// function addList() {}

// add note to page, localstorage, and add key to array
function addNote() {
  event.preventDefault();
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    let newLi = document.createElement("li");
    let newId = String(
      Number(noteKeys.length) === 0 ? 1 : Number(noteKeys[noteKeys.length - 1]) + 1
    );
    noteKeys.push(newId);

    // add note to list, local storage, and key array
    currentList.push(textToAdd.value);
    localStorage.setItem(currentListTitle, JSON.stringify(currentList));

    // add note to page with an id, edit button, and remove button
    newLi.innerHTML = "<div>" + textToAdd.value + "</div>";
    newLi.id = newId;
    newLi.appendChild(addEditButton(newId)).addEventListener("click", editNote);
    newLi.appendChild(addRemoveButton(newId)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(newLi);
    // clear input box
    textToAdd.value= "";
  }
}

// remove note from page, localstorage, and remove key from array
function removeNote(e) {
  let note = e.target.parentElement;
  note.remove();
  currentList.splice(note.id, 1);
  localStorage.setItem(currentListTitle, JSON.stringify(currentList));
  noteKeys = noteKeys.filter((key) => key !== note.id);
  console.log(noteKeys);
}

// open input box with existing content to allow editing of content
function editNote(e) {
  // store existing parent li, child text div, and text content
  let parentLi = e.target.parentElement;
  let childDiv = e.target.parentElement.firstElementChild;
  let currentText = e.target.parentElement.firstElementChild.textContent;

  // create and populate new input box for editing
  let editInputBox = document.createElement("span");
  editInputBox.role = "textbox";
  editInputBox.contentEditable = true;
  editInputBox.innerText = currentText;

  // replace existing text div with editing input box
  parentLi.replaceChild(editInputBox, childDiv);
  editInputBox.focus();
  // place text cursor at end of input box (span)
  document.getSelection().collapse(editInputBox, 1);

  // swap to save edit and discard edit buttons, and store save edit, edit, and remove buttons
  let [discardEditButton, saveEditButton, editButton, removeButton] = swapToEditButtons(parentLi.id);

  // pass event object and temporarily removed buttons to event handler on click
  discardEditButton.addEventListener("click", (event) => {
    let dataToPass = {"event": event, "args": [editButton, removeButton]};
    exitNoteEdit(dataToPass);
  });
  saveEditButton.addEventListener("click", (event) => {
    let dataToPass = {"event": event, "args": [editButton, removeButton]};
    exitNoteEdit(dataToPass);
  });
  // allow pressing enter key within input box to trigger save edit button
  // or pressing escape key to cancel changes
  editInputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      document.getElementById(saveEditButton.id).click();
    } else if (event.key === "Escape") {
      document.getElementById(discardEditButton.id).click();
    }
  });
}

// handle saving of edited note to page and localstorage, or discarding edit
function exitNoteEdit(dataToPass) {
  let editButton = dataToPass.args[0];
  let removeButton = dataToPass.args[1];

  // store existing parent li, child input box, text content, and button
  let parentLi = dataToPass.event.target.parentElement;
  let childInputBox = dataToPass.event.target.parentElement.firstElementChild;
  let edittedText = dataToPass.event.target.parentElement.firstElementChild.innerText;
  let discardEditButton = dataToPass.event.target.parentElement.lastElementChild;
  let saveEditButton = dataToPass.event.target.parentElement.lastElementChild.previousElementSibling;

  // create new div and populate with editted text content or old content
  let newTextDiv = document.createElement("div");
  if (event.target.className == "save-edit") {
    localStorage.setItem(parentLi.id, edittedText);
    newTextDiv.textContent = edittedText;
  } else {
    newTextDiv.textContent = localStorage.getItem(parentLi.id);
  }

  // swap in updated text div, edit button, and remove button
  parentLi.replaceChild(newTextDiv, childInputBox);
  parentLi.replaceChild(editButton, saveEditButton);
  parentLi.replaceChild(removeButton, discardEditButton);
}