import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";

let titles = Object.keys(localStorage);
sortTitleArray();
let titleKeys = [];
let currentTitle = 
  titles.find(t => t.endsWith("_current")) || "0_My Notes_current";
// add first default title to titles array on first load
if (titles.length === 0) titles = [currentTitle];
let currentTitleKey = currentTitle.substring(0, currentTitle.indexOf("_"));
let userFacingTitle = currentTitle
  .substring(currentTitle.indexOf("_") + 1, currentTitle.lastIndexOf("_"));
let currentList = JSON.parse(localStorage.getItem(currentTitle)) || [];

// add current title to page, clear input box, set up event listeners, display notes
window.onload = () => {
  document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${currentTitleKey}`;
  document.getElementById("list-select-button").addEventListener("click", toggleListMenu);
  document.getElementById("add-list-button").addEventListener("click", addList);
  document.getElementById("edit-button-header").addEventListener("click", editText);
  document.getElementById("form-button").addEventListener("click", addNote);
  document.getElementById("text-to-add").value = "";
  window.addEventListener("click", closeListMenu);

  // populate title key array and list menu
  for (let i = 0; i < titles.length; i++) {
    titleKeys[i] = titles[i].substring(0, titles[i].indexOf("_"));
    generateListMenu(i);
  }

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

function sortTitleArray() {
  titles.sort((a, b) => {
    if (
      Number(a.substring(0, a.indexOf("_"))) <
      Number(b.substring(0, a.indexOf("_")))
    )
      return -1;
    if (
      Number(a.substring(0, a.indexOf("_"))) >
      Number(b.substring(0, a.indexOf("_")))
    )
      return 1;
    return 0;
  });
}

// add list titles to title menu and attach event listeners
function generateListMenu(i) {
  let menuItemDivider = document.createElement("hr");
  let menuItemElement = document.createElement("span");
  menuItemElement.id = `title-${i}`;
  if (titles[i] === currentTitle) {
    menuItemElement.textContent = titles[i].substring(
      titles[i].indexOf("_") + 1,
      titles[i].lastIndexOf("_")
    );
  } else {
    menuItemElement.textContent = titles[i].substring(
      titles[i].indexOf("_") + 1,
    );
  }

  document.getElementById("list-select-content").appendChild(menuItemDivider);
  document.getElementById("list-select-content").appendChild(menuItemElement);
  menuItemElement.addEventListener("click", changeList);
}

function addList() {
  const newKey = titles.length;
  const newTitle = `${newKey}_New List_current`;

  // remove current from previous title
  const prevList = JSON.parse(localStorage.getItem(currentTitle)) || [];
  let prevTitle = currentTitle;
  prevTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
  localStorage.setItem(prevTitle, JSON.stringify(prevList));
  localStorage.removeItem(currentTitle);

  // add new title to localstorage
  localStorage.setItem(newTitle, "[]");

  // update title and title key arrays
  titleKeys.push(newKey);
  titles.push(newTitle);

  // update current title and title key to reflect new list
  currentTitle = newTitle;
  currentTitleKey = newKey;
  userFacingTitle = currentTitle
    .substring(currentTitle.indexOf("_") + 1, currentTitle.lastIndexOf("_"));

  // remove previous list from the screen and list array
  document.getElementById("list").innerHTML = "";
  document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
  currentList = [];

  // add new list to list menu
  generateListMenu(newKey);
}

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
// remember to realign title key array on list remove
// function emptyTrash(e) {}

// open or close the list selection menu when clicking its button
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

// change to the list selected in the list select menu
function changeList(e) {
  const newKey = e.target.id.substring(
    e.target.id.indexOf("-") + 1,
    e.target.id.length
  );

  if (newKey !== currentTitleKey) {
    let newTitle = `${newKey}_${e.target.textContent}`;
    const newList = JSON.parse(localStorage.getItem(newTitle));
    newTitle = newTitle.concat("_current");
    const prevTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
    const prevList = currentList;

    // update localstorage entries for previous and new list
    localStorage.setItem(newTitle, JSON.stringify(newList));
    localStorage.removeItem(`${newKey}_${e.target.textContent}`);
    localStorage.setItem(prevTitle, JSON.stringify(prevList));
    localStorage.removeItem(currentTitle);

    // update variables tracking current titles, keys, and list
    currentTitle = newTitle;
    currentTitleKey = newKey;
    userFacingTitle = e.target.textContent;
    currentList = newList;

    // update the page to show the new list
    document.getElementById("list").innerHTML = "";
    document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
    initializeCurrentList();
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

      // also update title in list select menu
      let menuItem = document.getElementById(`title-${currentTitleKey}`);
      menuItem.textContent = edittedText;
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