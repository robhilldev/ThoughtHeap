import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";
import { toggleListMenu, closeListMenu } from "./Interaction.js";

// most of these variables are for managing state
const DEFAULT_INITIAL_TITLE = "0_My Thoughts";
let titles = Object.keys(localStorage);
let titleKeys = [];
let currentTitle = 
  titles.find(t => t.endsWith("_current")) || DEFAULT_INITIAL_TITLE;
// remove current tag from currentTitle variable
if (currentTitle.includes("_current")) {
  currentTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
}
// add first default title to titles array on first load
if (titles.length === 0) titles.push(currentTitle);
// remove current tag from titles array if present
titles = titles.map((t) => {
  if (t.includes("_current")) return t.substring(0, t.lastIndexOf("_"));
  else return t;
});
let currentTitleKey = currentTitle.substring(0, currentTitle.indexOf("_"));
// add first default title key to titleKeys array on first load
if (titleKeys.length === 0) titleKeys.push(currentTitleKey);
let userFacingTitle = currentTitle.substring(currentTitle.indexOf("_") + 1);
let currentList = JSON.parse(
  localStorage.getItem(currentTitle.concat("_current"))
) || [];

// add current title to page, clear input box, set up event listeners, display notes
window.onload = () => {
  document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${currentTitleKey}`;
  document.getElementById("list-select-button").addEventListener("click", toggleListMenu);
  document.addEventListener("click", closeListMenu);
  document.getElementById("add-list-button").addEventListener("click", addList);
  document.getElementById("edit-button-header").addEventListener("click", editText);
  document.getElementById("remove-button-header").addEventListener("click", removeList);
  document.getElementById("form-button").addEventListener("click", addNote);
  document.getElementById("text-to-add").value = "";

  sortTitlesArray();
  generateTitleKeys();
  initializeCurrentList();
  generateListMenu();
};

// retrieve the current list from localstorage and display it on the page
function initializeCurrentList() {
  for (let i = 0; i < currentList.length; i++) {
    // only show note if not marked for deletion
    if (!currentList[i].startsWith("x_", 0) && !currentList[i].endsWith("_x")) {
      const currentLi = document.createElement("li");
      currentLi.innerHTML = `<div id=note-${i}>` + currentList[i] + "</div>";
      currentLi.id = i;
      currentLi.appendChild(addEditButton(i)).addEventListener("click", editText);
      currentLi.appendChild(addRemoveButton(i)).addEventListener("click", removeNote);
      document.getElementById("list").appendChild(currentLi);
    }
  }
}

// make sure title array is sorted based on preceding key values
function sortTitlesArray() {
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

// populate title key array
function generateTitleKeys() {
  for (let i = 0; i < titles.length; i++) {
    titleKeys[i] = titles[i].substring(0, titles[i].indexOf("_"));
  }
}

// add list titles to title menu and attach event listeners
function generateListMenu() {
  const menuContent = document.getElementById("list-select-content");
  const pageTitleId = document.getElementById("header").firstElementChild.id;

  // remove previous menu titles if any
  while(menuContent.children.length > 1) {
    menuContent.removeChild(
      menuContent.children[menuContent.children.length - 1]
    );
  }

  // generate new menu titles
  for (let i = 0; i < titles.length; i++) {
    let menuItemDivider = document.createElement("hr");
    let menuItemElement = document.createElement("span");
    menuItemElement.id = `title-menu-${titleKeys[i]}`;
    menuItemDivider.id = `title-menu-divider-${titleKeys[i]}`;

    menuItemElement.textContent = titles[i].substring(
      titles[i].indexOf("_") + 1, titles[i].length
    );

    // add arrow to currently viewed list title and make it bold
    if (titles[i].substring(0, titles[i].indexOf("_"))
        === pageTitleId.substring(pageTitleId.lastIndexOf("-") + 1)) {
      menuItemElement.innerHTML
        = `&rArr;&nbsp;&nbsp;${menuItemElement.textContent}`;
      menuItemElement.style.fontWeight = "900";
    }

    menuContent.appendChild(menuItemDivider);
    menuContent.appendChild(menuItemElement);
    menuItemElement.addEventListener("click", changeList);
  }
}

// add list to page and localstorage, update title variables
function addList() {
  // make new title key one higher than the max existing title key value
  const newKey = String(
    Number(titleKeys.reduce((max, n) => n > max ? n : max)) + 1
  );
  const newTitle = `${newKey}_New List`;

  // update local storage for current and new lists
  localStorage.setItem(currentTitle, JSON.stringify(currentList));
  localStorage.removeItem(currentTitle.concat("_current"));
  localStorage.setItem(newTitle.concat("_current"), "[]");

  // update title and title key arrays
  titleKeys.push(newKey);
  titles.push(newTitle);

  // update current title, title key, and list to reflect new list
  currentTitle = newTitle;
  currentTitleKey = newKey;
  userFacingTitle = currentTitle.substring(currentTitle.indexOf("_") + 1);
  currentList = [];

  // remove previous list from the screen and list array
  document.getElementById("list").innerHTML = "";
  document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${newKey}`;

  // add new list to list menu
  generateListMenu();
}

// add note to page and localstorage, update list variables
function addNote(e) {
  e.preventDefault();
  const textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    // create li element for housing new note and create id
    const newLi = document.createElement("li");
    const newId = String(currentList.length === 0 ? 0 : currentList.length);

    // add note to list array
    currentList.push(textToAdd.value);

    // add note to localstorage
    localStorage.setItem(
      currentTitle.concat("_current"),
      JSON.stringify(currentList)
    );

    // add note to page with an id, edit button, and remove button
    newLi.innerHTML = `<div id=note-${newId}>` + textToAdd.value + "</div>";
    newLi.id = newId;
    newLi.appendChild(addEditButton(newId)).addEventListener("click", editText);
    newLi.appendChild(addRemoveButton(newId)).addEventListener("click", removeNote);
    document.getElementById("list").appendChild(newLi);

    // clear input box
    textToAdd.value = "";
  }
}

// remove note from page and list array, mark note for deletion in localstorage
function removeNote(e) {
  const note = e.target.parentElement;
  note.remove();
  currentList.splice(note.id, 1, `x_${note.firstElementChild.textContent}_x`);
  localStorage.setItem(
    currentTitle.concat("_current"),
    JSON.stringify(currentList)
  );
}

// remove current list from page and localstorage, update state variables
function removeList() {
  if (localStorage.length > 0) {
    // update title and key arrays first for use in determining next list
    titles.splice(titles.indexOf(currentTitle), 1);
    titleKeys.splice(titleKeys.indexOf(currentTitleKey), 1);

    // determine next title and list to display
    const nextTitle = titles[0] ? titles[0] : DEFAULT_INITIAL_TITLE;
    const nextTitleKey = nextTitle.substring(0, nextTitle.indexOf("_"));
    const nextList = JSON.parse(localStorage.getItem(nextTitle)) || [];
    userFacingTitle = nextTitle.substring(nextTitle.indexOf("_") + 1);
    
    // remove list from page
    document.getElementById("list").innerHTML = "";

    // update titles and titleKeys arrays upon last list deletion
    if (titles.length === 0) {
      titles.push(nextTitle);
      titleKeys.push(nextTitleKey);
    }

    // add next title to page
    document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
    document.getElementsByTagName("h1")[0].id = `title-${nextTitleKey}`;

    // remove list from localstorage and tag next list with _current
    localStorage.removeItem(currentTitle.concat("_current"));
    if (localStorage.getItem(nextTitle)) {
      localStorage.setItem(
        nextTitle.concat("_current"),
        JSON.stringify(nextList)
      );
      localStorage.removeItem(nextTitle);
    } else {
      localStorage.setItem(
        nextTitle.concat("_current"),
        JSON.stringify(nextList)
      );
    }
    
    // update remainder of state tracking variables
    currentTitle = nextTitle;
    currentTitleKey = nextTitleKey;
    currentList = nextList;

    // add next list to page and update list menu
    initializeCurrentList();
    generateListMenu();
  }
}

// change to the list selected in the list select menu
function changeList(e) {
  const newKey = e.target.id.substring(
    e.target.id.lastIndexOf("-") + 1,
    e.target.id.length
  );

  // given the menu item selected is not the already viewed list
  if (newKey !== currentTitleKey) {
    // store new title and list
    let newTitle = titles.find((t) => t.startsWith(newKey));
    const newList = JSON.parse(localStorage.getItem(newTitle));

    // update localstorage entries for current and new list
    localStorage.setItem(newTitle.concat("_current"), JSON.stringify(newList));
    localStorage.removeItem(newTitle);
    localStorage.setItem(currentTitle, JSON.stringify(currentList));
    localStorage.removeItem(currentTitle.concat("_current"));

    // update state variables
    currentTitle = newTitle;
    currentTitleKey = newKey;
    userFacingTitle = newTitle.substring(newTitle.indexOf("_") + 1);
    currentList = newList;

    // update the page to show the new list
    document.getElementById("list").innerHTML = "";
    document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
    document.getElementsByTagName("h1")[0].id = `title-${newKey}`;
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
    swapToEditButtons(parent.id);

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
  } else if (parent.tagName === "HEADER") {
    // on title edit
    if (dataToPass.e.target.className == "save-edit") {
      // create new title and update title in titles array
      const newTitle = `${currentTitleKey}_${edittedText}`;
      titles.splice(titles.indexOf(currentTitle), 1, newTitle);

      // update title in localstorage
      localStorage.setItem(
        newTitle.concat("_current"),
        JSON.stringify(currentList)
      );
      localStorage.removeItem(currentTitle.concat("_current"));

      // update state variables and page title
      currentTitle = newTitle;
      userFacingTitle = edittedText;
      textElement.textContent = edittedText;

      // also update title in list select menu
      generateListMenu();
    } else {
      // put back existing text
      textElement.textContent = userFacingTitle;
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
