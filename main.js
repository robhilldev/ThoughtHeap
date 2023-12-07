import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";

let titles = Object.keys(localStorage);
let lists = Object.values(localStorage);
// VVV this should determine the "_current" title eventually instead of first title VVV
let currentTitle = titles.length > 0 ? titles[0] : "1_My Notes_current";
// VVV this should determine the current list eventually instead of first list VVV
let currentList = lists.length > 0 ? JSON.parse(lists[0]) : [];
// let titleKeys = [];
let noteKeys = [];

// add current title to page, clear input box, set up add note button, display notes
window.onload = function() {
  document.getElementsByTagName("h1")[0].textContent = currentTitle.split("_")[1];
  document.getElementsByTagName("h1")[0].id = `title-${currentTitle.split("_")[0]}`;
  document.getElementsByTagName("header")[0]
    .appendChild(addEditButton("header"))
    .addEventListener("click", editText);
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
  // also update title key from current title
  // titleKeys.push();
  for (let i = 0; i < currentList.length; i++) {
    // also update keys for this list of notes
    noteKeys.push(String(i));
    let currentLi = document.createElement("li");
    currentLi.innerHTML = "<div>" + currentList[i] + "</div>";
    currentLi.id = i;
    currentLi.appendChild(addEditButton(i)).addEventListener("click", editText);
    currentLi.appendChild(addRemoveButton(i)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(currentLi);
  }
}

// function addList() {}

// add note to page, localstorage, and add key to array
function addNote() {
  event.preventDefault();
  let textToAdd = document.getElementById("text-to-add");
  
  // create li element for housing new note and create key
  if (textToAdd.value) {
    let newLi = document.createElement("li");
    let newId = String(
      Number(noteKeys.length) === 0 ? 1 : Number(noteKeys[noteKeys.length - 1]) + 1
    );

    // add note to list, local storage, and note key to array
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
    textToAdd.value= "";
  }
}

// remove note from page, localstorage, and remove key from array
function removeNote(e) {
  let note = e.target.parentElement;
  note.remove();
  currentList.splice(note.id, 1);
  localStorage.setItem(currentTitle, JSON.stringify(currentList));
  noteKeys = noteKeys.filter((key) => key !== note.id);
}

// open input box with existing content to allow editing of content
function editText(e) {
  // store existing parent element, first child element, and text content
  let parent = e.target.parentElement;
  let firstChild = e.target.parentElement.firstElementChild;
  let currentText = e.target.parentElement.firstElementChild.textContent;

  // create and populate new input box for editing
  let editInputBox = document.createElement("span");
  editInputBox.role = "textbox";
  editInputBox.contentEditable = true;
  editInputBox.innerText = currentText;

  // replace existing first child element with editing input box
  parent.replaceChild(editInputBox, firstChild);
  editInputBox.focus();
  // place text cursor at end of input box (span)
  document.getSelection().collapse(editInputBox, 1);

  // swap to save edit and discard edit buttons, and store save edit, edit, and remove buttons
  let [discardEditButton, saveEditButton, editButton, removeButton] = swapToEditButtons(parent.id);

  // pass event object and temporarily removed buttons to event handler on click
  discardEditButton.addEventListener("click", (event) => {
    let dataToPass = {"event": event, "args": [editButton, removeButton]};
    exitTextEdit(dataToPass);
  });
  saveEditButton.addEventListener("click", (event) => {
    let dataToPass = {"event": event, "args": [editButton, removeButton]};
    exitTextEdit(dataToPass);
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
function exitTextEdit(dataToPass) {
  let editButton = dataToPass.args[0];
  let removeButton = dataToPass.args[1];

  // store existing parent element, child input box, text content, and button
  let parent = dataToPass.event.target.parentElement;
  let childInputBox = dataToPass.event.target.parentElement.firstElementChild;
  let edittedText = dataToPass.event.target.parentElement.firstElementChild.innerText;
  let discardEditButton = dataToPass.event.target.parentElement.lastElementChild;
  let saveEditButton = dataToPass.event.target.parentElement.lastElementChild.previousElementSibling;

  // create new first child element, populate with editted text or old text
  if (parent.tagName === "LI") {
    let newTextElement = document.createElement("div");
    if (event.target.className == "save-edit") {
      // update list array with new value, localstorage, and page
      currentList.splice(parent.id, 1, edittedText);
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      newTextElement.textContent = edittedText;
    } else {
      // put back existing value
      newTextElement.textContent = currentList[parent.id];
    }
    // swap in updated first child element, edit button, and remove button
    parent.replaceChild(newTextElement, childInputBox);
    parent.replaceChild(editButton, saveEditButton);
    parent.replaceChild(removeButton, discardEditButton);
  } else if (parent.tagName === "HEADER") {
    let newTextElement = document.createElement("h1");
    if (event.target.className == "save-edit") {
      // store current title, update current title in multiple places
      let titleBeingChanged = currentTitle;
      currentTitle = `${currentTitle.split("_")[0]}_${edittedText}_current`;
      titles.splice(titleBeingChanged.split("_")[0], 1, currentTitle);
      // create a new entry in localstorage with new title, remove old entry
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      localStorage.removeItem(titleBeingChanged);
      // update title on page
      newTextElement.textContent = edittedText;
    } else {
      // put back existing value
      newTextElement.textContent = currentTitle.split("_")[1];
    }
    // swap in updated first child element and edit button, remove discard button
    parent.replaceChild(newTextElement, childInputBox);
    parent.replaceChild(editButton, saveEditButton);
    parent.removeChild(discardEditButton);
  }
}