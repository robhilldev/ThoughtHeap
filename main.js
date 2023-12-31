import {
  state,
  initializeState,
  createLocalState,
  updateState,
} from "./modules/State.js";
import { updateStorage } from "./modules/Storage.js";
import * as interaction from "./modules/Interaction.js";
import * as button from "./modules/Button.js";

document.onreadystatechange = () => {
  if (document.readyState === "complete") {
    initializeState();
    initializePage();
    initializeCurrentList();
    generateListMenu();
  }
};

// set up page elements and event listeners not specific to a list
function initializePage() {
  document.getElementsByTagName("h1")[0].textContent = state.userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${state.currentTitleKey}`;
  document
    .getElementById("list-select-button")
    .addEventListener("click", interaction.toggleListMenu);
  document.addEventListener("click", interaction.closeListMenu);
  document.getElementById("add-list-button").addEventListener("click", addList);
  document
    .getElementById("edit-button-header")
    .addEventListener("click", editText);
  document
    .getElementById("remove-button-header")
    .addEventListener("click", removeList);
  document.getElementById("form-button").addEventListener("click", addNote);
  document.getElementById("text-to-add").value = "";
}

// retrieve the current list from localstorage and display it on the page
function initializeCurrentList() {
  for (let i = 0; i < state.currentList.length; i++) {
    // only show note if not marked for deletion
    if (
      !state.currentList[i].startsWith("x_", 0) &&
      !state.currentList[i].endsWith("_x")
    ) {
      const currentLi = document.createElement("li");
      currentLi.innerHTML =
        `<div id=note-${i}>` + state.currentList[i] + "</div>";
      currentLi.id = i;
      currentLi
        .appendChild(button.addEditButton(i))
        .addEventListener("click", editText);
      currentLi
        .appendChild(button.addRemoveButton(i))
        .addEventListener("click", removeNote);
      document.getElementById("list").appendChild(currentLi);
    }
  }
}

// add list titles to title menu and attach event listeners
function generateListMenu() {
  const menuContent = document.getElementById("list-select-content");
  const pageTitleId = document.getElementById("header").firstElementChild.id;

  // remove previous menu titles if any
  while (menuContent.children.length > 1) {
    menuContent.removeChild(
      menuContent.children[menuContent.children.length - 1]
    );
  }

  // generate new menu titles
  for (let i = 0; i < state.titles.length; i++) {
    let menuItemDivider = document.createElement("hr");
    let menuItemElement = document.createElement("span");
    let menuItemKey = state.titles[i].substring(
      0,
      state.titles[i].indexOf("_")
    );
    menuItemElement.id = `title-menu-${menuItemKey}`;
    menuItemDivider.id = `title-menu-divider-${menuItemKey}`;

    menuItemElement.textContent = state.titles[i].substring(
      state.titles[i].indexOf("_") + 1
    );

    // add arrow to currently viewed list title and make it bold
    if (
      menuItemKey === pageTitleId.substring(pageTitleId.lastIndexOf("-") + 1)
    ) {
      menuItemElement.innerHTML = `&rArr;&nbsp;&nbsp;${menuItemElement.textContent}`;
      menuItemElement.style.fontWeight = "900";
    }

    // add divider and title to menu
    menuContent.appendChild(menuItemDivider);
    menuContent.appendChild(menuItemElement);
    menuItemElement.addEventListener("click", changeList);
  }
}

// add list to localstorage, update state variables, add list to page
function addList() {
  const [newKey, newTitle] = createLocalState("addList");
  updateStorage("addList", state.currentTitle, state.currentList, newTitle);
  updateState("addList", newKey, newTitle);

  document.getElementById("list").innerHTML = "";
  document.getElementsByTagName("h1")[0].textContent = state.userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${newKey}`;
  generateListMenu();

  // open title edit box
  document.getElementById("edit-button-header").click();
}

// add to localstorage, update state variables, add note to page
function addNote(e) {
  e.preventDefault();
  const textToAdd = document.getElementById("text-to-add");

  if (textToAdd.value) {
    const [newLi, newId] = createLocalState("addNote");
    updateState("addNote", textToAdd.value);
    updateStorage("addNote", state.currentTitle, state.currentList);

    newLi.innerHTML = `<div id=note-${newId}>` + textToAdd.value + "</div>";
    newLi.id = newId;
    newLi
      .appendChild(button.addEditButton(newId))
      .addEventListener("click", editText);
    newLi
      .appendChild(button.addRemoveButton(newId))
      .addEventListener("click", removeNote);
    document.getElementById("list").appendChild(newLi);

    // clear input box
    textToAdd.value = "";
  }
}

// remove list from localstorage, update state variables, remove from page
function removeList() {
  if (localStorage.length > 0) {
    const [nextTitle, nextTitleKey, nextList] = createLocalState("removeList");
    updateStorage("removeList", state.currentTitle, nextTitle, nextList);
    updateState("removeList", nextTitle, nextTitleKey, nextList);

    document.getElementById("list").innerHTML = "";
    document.getElementsByTagName("h1")[0].textContent = state.userFacingTitle;
    document.getElementsByTagName("h1")[0].id = `title-${nextTitleKey}`;
    initializeCurrentList();
    generateListMenu();
  }
}

// remove note from page, update state, mark note for deletion in localstorage
function removeNote(e) {
  const note = e.target.parentElement;
  note.remove();
  updateState(
    "removeNote",
    note.id,
    `x_${note.firstElementChild.textContent}_x`
  );
  updateStorage("removeNote", state.currentTitle, state.currentList);
}

// change to the list selected in the list select menu
function changeList(e) {
  const nextTitleKey = e.target.id.substring(e.target.id.lastIndexOf("-") + 1);

  // given the menu item selected is not the already viewed list
  if (nextTitleKey !== state.currentTitleKey) {
    const [nextTitle, nextList] = createLocalState("changeList", nextTitleKey);
    updateStorage(
      "changeList",
      state.currentTitle,
      state.currentList,
      nextTitle,
      nextList
    );
    updateState("changeList", nextTitle, nextTitleKey, nextList);

    document.getElementById("list").innerHTML = "";
    document.getElementsByTagName("h1")[0].textContent = state.userFacingTitle;
    document.getElementsByTagName("h1")[0].id = `title-${nextTitleKey}`;
    initializeCurrentList();
    generateListMenu();
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
  editInputBox.id = `edit-input-box-${textElement.id.substring(
    textElement.id.lastIndexOf("-") + 1
  )}`;
  editInputBox.className = "edit-input-box";
  editInputBox.role = "textbox";
  editInputBox.contentEditable = true;
  editInputBox.textContent = currentText;

  // hide list select menu button on title edit
  if (parent.id === "header") {
    document.getElementById("list-select-dropdown").style.display = "none";
  }

  // swap existing text element for editing input box on page
  parent.replaceChild(editInputBox, textElement);

  // focus the input box and place the text cursor at end of it
  editInputBox.focus();
  document.getSelection().collapse(editInputBox, 1);

  // swap to edit mode buttons, store default mode buttons
  const [discardEditButton, saveEditButton, editButton, removeButton] =
    button.swapToEditButtons(parent.id);

  // pass event object, removed buttons, and text element to event handler on click
  discardEditButton.addEventListener("click", (e) => {
    const dataToPass = {
      e: e,
      args: [editButton, removeButton, textElement],
    };
    exitTextEdit(dataToPass);
  });
  saveEditButton.addEventListener("click", (e) => {
    const dataToPass = {
      e: e,
      args: [editButton, removeButton, textElement],
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

// handle saving and discarding edits
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

  // swap back to text element, populate with editted text or previous text
  if (parent.tagName === "LI") {
    // on note edit
    if (dataToPass.e.target.className == "save-edit") {
      updateState("exitTextEditNote", parent.id, edittedText);
      updateStorage("exitTextEditNote", state.currentTitle, state.currentList);

      // update page
      textElement.textContent = edittedText;
    } else {
      // on discard edit, put back existing text
      textElement.textContent = state.currentList[parent.id];
    }
  } else if (parent.tagName === "HEADER") {
    // on title edit
    if (dataToPass.e.target.className == "save-edit") {
      const [newTitle] = createLocalState("exitTextEditTitle", edittedText);
      updateStorage(
        "exitTextEditTitle",
        state.currentTitle,
        state.currentList,
        newTitle
      );
      updateState("exitTextEditTitle", newTitle, edittedText);

      // update page
      textElement.textContent = edittedText;
      generateListMenu();
    } else {
      // on discard edit, put back existing text
      textElement.textContent = state.userFacingTitle;
    }

    // make list select menu button visible again
    document
      .getElementById("list-select-dropdown")
      .style.removeProperty("display");
  }

  // swap in updated text element, edit button, and remove button
  parent.replaceChild(textElement, childInputBox);
  parent.replaceChild(editButton, saveEditButton);
  parent.replaceChild(removeButton, discardEditButton);
}

// TO IMPLEMENT:
// function emptyTrash(e) {}
