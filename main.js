import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";

let titles = Object.keys(localStorage);
// let titleKeys = [];
let currentTitle = 
  titles.find(t => t.endsWith("_current")) || "0_My Notes_current";
let currentTitleKey = currentTitle.substring(0, currentTitle.indexOf("_"));
let userFacingTitle = currentTitle
  .substring(currentTitle.indexOf("_") + 1, currentTitle.lastIndexOf("_"));
let currentList = JSON.parse(localStorage.getItem(currentTitle)) || [];

// add current title to page, clear input box, set up event listeners, display notes
window.onload = () => {
  document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${currentTitleKey}`;
  document.getElementById("list-select-button").addEventListener("click", toggleListMenu);
  document.getElementById("edit-button-header").addEventListener("click", editText);
  document.getElementById("form-button").addEventListener("click", addNote);
  document.getElementById("text-to-add").value = "";
  window.addEventListener("click", closeListMenu);

  initializeCurrentList();
};

// retrieve the current list from localstorage and display it on the page
function initializeCurrentList() {
  for (let i = 0; i < currentList.length; i++) {
    // only show note if not marked for deletion
    if (!currentList[i].startsWith("x_", 0) && !currentList[i].endsWith("_x")) {
      const currentLi = document.createElement("li");
      currentLi.innerHTML = "<div>" + currentList[i] + "</div>";
      currentLi.id = i;
      currentLi.appendChild(addEditButton(i)).addEventListener("click", editText);
      currentLi.appendChild(addRemoveButton(i)).addEventListener("click", removeNote);
      document.getElementById("list").appendChild(currentLi);
    }
  }
}

// function addList() {}

// add note to page and localstorage
function addNote(e) {
  e.preventDefault();
  const textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    // create li element for housing new note and create id
    const newLi = document.createElement("li");
    const newId = String(currentList.length === 0 ? 0 : currentList.length);

    // add note to list array and local storage
    currentList.push(textToAdd.value);
    localStorage.setItem(currentTitle, JSON.stringify(currentList));

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
  const note = e.target.parentElement;
  note.remove();
  currentList.splice(note.id, 1, `x_${note.firstElementChild.textContent}_x`);
  localStorage.setItem(currentTitle, JSON.stringify(currentList));
}

// function removeList(e) {}
// function emptyTrash(e) {}

// open or close the list selection menu
function toggleListMenu() {
  document.getElementById("list-select-content").classList.toggle("visible");
}

// close the list menu when clicking outside of it or on a menu item
function closeListMenu(e) {
  const listSelectButton = document.getElementById("list-select-button");
  const listSelectContent = document.getElementById("list-select-content");
  if (e.target !== listSelectButton && e.target !== listSelectContent) {
    listSelectContent.classList.remove("visible");
  }
}

// open input box with existing content to allow editing of content
function editText(e) {
  // store existing parent element, text element, and text content
  const parent = e.target.parentElement;
  const textElement = parent.firstElementChild;
  const currentText = parent.firstElementChild.textContent;

  // create and populate new input box for editing
  const editInputBox = document.createElement("span");
  editInputBox.id = "edit-input-box";
  editInputBox.role = "textbox";
  editInputBox.contentEditable = true;
  editInputBox.textContent = currentText;

  // replace existing text element with editing input box
  parent.replaceChild(editInputBox, textElement);
  editInputBox.focus();
  // place text cursor at end of input box (span)
  document.getSelection().collapse(editInputBox, 1);

  // swap to save edit and discard edit buttons, store save edit, edit, and remove buttons
  const [discardEditButton, saveEditButton, editButton, removeButton] = swapToEditButtons(parent.id);

  // pass event object, removed buttons, and text element to event handler on click
  discardEditButton.addEventListener("click", (e) => {
    const dataToPass = {
      "e": e,
      "args": [editButton, removeButton, textElement]
    };
    exitTextEdit(dataToPass);
  });
  saveEditButton.addEventListener("click", (e) => {
    const dataToPass = {
      "e": e,
      "args": [editButton, removeButton, textElement]
    };
    exitTextEdit(dataToPass);
  });
  
  // within input box, make enter trigger save edit and escape trigger discard edit
  editInputBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById(saveEditButton.id).click();
    } else if (e.key === "Escape") {
      document.getElementById(discardEditButton.id).click();
    }
  });
}

// handle saving of edited content to page and localstorage, or discarding edit
function exitTextEdit(dataToPass) {
  const editButton = dataToPass.args[0];
  const removeButton = dataToPass.args[1];
  const textElement = dataToPass.args[2];

  // store existing parent element, child input box, text content, and buttons
  const parent = dataToPass.e.target.parentElement;
  const childInputBox = parent.firstElementChild;
  const edittedText = parent.firstElementChild.textContent;
  const discardEditButton = parent.lastElementChild;
  const saveEditButton = parent.lastElementChild.previousElementSibling;

  // swap back to text element, populate with editted text or old text
  if (parent.tagName === "LI") {
    // on note edit
    if (dataToPass.e.target.className == "save-edit") {
      // update list array and localstorage, populate new text element
      currentList.splice(parent.id, 1, edittedText);
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      textElement.textContent = edittedText;
    } else {
      // put back existing text
      textElement.textContent = currentList[parent.id];
    }
    // swap in updated text element, edit button, and remove button
    parent.replaceChild(textElement, childInputBox);
    parent.replaceChild(editButton, saveEditButton);
    parent.replaceChild(removeButton, discardEditButton);
  } else if (parent.tagName === "HEADER") {
    // on title edit
    if (dataToPass.e.target.className == "save-edit") {
      // update title array and localstorage, populate new text element
      const previousTitle = currentTitle;
      currentTitle = `${currentTitleKey}_${edittedText}_current`;
      titles.splice(currentTitleKey, 1, currentTitle);
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      localStorage.removeItem(previousTitle);
      userFacingTitle = edittedText;
      textElement.textContent = edittedText;
    } else {
      // put back existing text
      textElement.textContent = currentTitle.split("_")[1];
    }
    // swap in updated text element and edit button, remove discard button
    parent.replaceChild(textElement, childInputBox);
    parent.replaceChild(editButton, saveEditButton);
    parent.removeChild(discardEditButton);
  }
}