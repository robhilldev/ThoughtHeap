import { addRemoveButton, addEditButton, swapToEditButtons } from "./Button.js";
import { toggleListMenu, closeListMenu } from "./Interaction.js";

// most of these variables are for managing state
const DEFAULT_INITIAL_TITLE = "0_My Thoughts_current";
let titles = Object.keys(localStorage);
sortTitlesArray();
let titleKeys = [];
let previousTitle = null;
let currentTitle = 
  titles.find(t => t.endsWith("_current")) || DEFAULT_INITIAL_TITLE;
// add first default title to titles array on first load
if (titles.length === 0) {
  titles.push(currentTitle.substring(0, currentTitle.lastIndexOf("_")));
}
// remove current tag from titles array if present
titles = titles.map((t) => {
  if (t.includes("_current")) return t.substring(0, t.lastIndexOf("_"));
  else return t;
});
let currentTitleKey = currentTitle.substring(0, currentTitle.indexOf("_"));
// add first default title key to titleKeys array on first load
if (titleKeys.length === 0) titleKeys.push(currentTitleKey);
let userFacingTitle = currentTitle
  .substring(currentTitle.indexOf("_") + 1, currentTitle.lastIndexOf("_"));
let previousList = null;
let currentList = JSON.parse(localStorage.getItem(currentTitle)) || [];

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

  // populate title key array and list menu
  for (let i = 0; i < titles.length; i++) {
    titleKeys[i] = titles[i].substring(0, titles[i].indexOf("_"));
  }

  initializeCurrentList();
  generateListMenu();
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
    menuItemElement.id = `title-menu-${i}`;
    menuItemDivider.id = `title-menu-divider-${i}`

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
  const newTitle = `${newKey}_New List_current`;

  // remove current from previous title
  previousList = JSON.parse(localStorage.getItem(currentTitle)) || [];
  previousTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
  localStorage.setItem(previousTitle, JSON.stringify(previousList));
  localStorage.removeItem(currentTitle);

  // add new title to localstorage
  localStorage.setItem(newTitle, "[]");

  // update title and title key arrays
  titleKeys.push(newKey);
  titles.push(newTitle.substring(0, newTitle.lastIndexOf("_")));

  // update current title and title key to reflect new list
  currentTitle = newTitle;
  currentTitleKey = newKey;
  userFacingTitle = currentTitle
    .substring(currentTitle.indexOf("_") + 1, currentTitle.lastIndexOf("_"));

  // remove previous list from the screen and list array
  document.getElementById("list").innerHTML = "";
  document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
  document.getElementsByTagName("h1")[0].id = `title-${newKey}`;
  currentList = [];

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

// remove current list from page and localstorage, update state variables
function removeList() {
  if (localStorage.length > 0) {
    // update title and key arrays first for use in determining next list
    titles.splice(
      titles.indexOf(currentTitle.substring(0, currentTitle.lastIndexOf("_"))),
      1
    );
    titleKeys.splice(titleKeys.indexOf(currentTitleKey), 1);

    // determine next title and list to display
    const nextTitle = titles[0]
      ? titles[0].concat("_current")
      : DEFAULT_INITIAL_TITLE;
    const nextTitleKey = nextTitle.substring(0, nextTitle.indexOf("_"));
    const nextList = JSON.parse(
      localStorage.getItem(nextTitle.substring(0, nextTitle.lastIndexOf("_")))
    ) 
      || [];
    userFacingTitle = nextTitle.substring(
      nextTitle.indexOf("_") + 1,
      nextTitle.lastIndexOf("_")
    );
    
    // remove list from page
    document.getElementById("list").innerHTML = "";
    // update titles and titleKeys arrays upon last list deletion
    if (titles.length === 0) {
      titles.push(nextTitle.substring(0, nextTitle.lastIndexOf("_")));
      titleKeys.push(nextTitleKey);
    }
    // add next title to page
    document.getElementsByTagName("h1")[0].textContent = userFacingTitle;
    document.getElementsByTagName("h1")[0].id = `title-${nextTitleKey}`;

    // remove list from localstorage and tag next list with _current
    localStorage.removeItem(currentTitle);
    if (localStorage.getItem(nextTitle.substring(0, nextTitle.lastIndexOf("_")))) {
      localStorage.setItem(nextTitle, JSON.stringify(nextList));
      localStorage.removeItem(nextTitle.substring(0, nextTitle.lastIndexOf("_")));
    } else {
      localStorage.setItem(nextTitle, JSON.stringify(nextList));
    }
    
    // update remainder of state tracking variables
    previousTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
    currentTitle = nextTitle;
    currentTitleKey = nextTitleKey;
    previousList = currentList;
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

  // given the menu item selected is not the current list
  if (newKey !== currentTitleKey) {
    // store new and previous title and list
    let newTitle = titles.find((t) => t.startsWith(newKey));
    const newList = JSON.parse(localStorage.getItem(newTitle));
    newTitle = newTitle.concat("_current");
    previousTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
    previousList = currentList;

    // update localstorage entries for previous and new list
    // update new list first to ensure at least one list always has _current
    localStorage.setItem(newTitle, JSON.stringify(newList));
    localStorage.removeItem(titles.find((t) => t.startsWith(newKey)));
    localStorage.setItem(previousTitle, JSON.stringify(previousList));
    localStorage.removeItem(currentTitle);

    // update variables tracking current titles, keys, and list
    currentTitle = newTitle;
    currentTitleKey = newKey;
    userFacingTitle = e.target.textContent;
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
  editInputBox.className = "edit-input-box";
  editInputBox.role = "textbox";
  editInputBox.contentEditable = true;
  editInputBox.textContent = currentText;

  // replace existing text element with editing input box
  parent.replaceChild(editInputBox, textElement);
  editInputBox.focus();
  // place text cursor at end of input box (span)
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
      // update title array and localstorage, populate new text element
      const previousTitle = currentTitle;
      currentTitle = `${currentTitleKey}_${edittedText}_current`;
      titles.splice(
        currentTitleKey, 1,
        currentTitle.substring(0, currentTitle.lastIndexOf("_"))
      );
      localStorage.setItem(currentTitle, JSON.stringify(currentList));
      localStorage.removeItem(previousTitle);
      userFacingTitle = edittedText;
      textElement.textContent = edittedText;

      // also update title in list select menu
      generateListMenu();
    } else {
      // put back existing text
      textElement.textContent = userFacingTitle;
    }
  }
  // swap in updated text element, edit button, and remove button
  parent.replaceChild(textElement, childInputBox);
  parent.replaceChild(editButton, saveEditButton);
  parent.replaceChild(removeButton, discardEditButton);
}

// TO IMPLEMENT:
// function emptyTrash(e) {}
