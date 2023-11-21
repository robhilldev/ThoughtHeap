let keys = Object.keys(localStorage);

window.onload = function() {
  document.getElementById("text-to-add").value = "";

  keys.sort((a, b) => {
    if (Number(a) < Number(b)) { return -1; }
    if (Number(a) > Number(b)) { return 1; }
    return 0;
  });
  instantiateList(keys);

  let addButton = document.getElementById("form-button");
  addButton.addEventListener("click", addListItem);
}

// create an instance of the list with items from localstorage
function instantiateList(keys) {
  for (let key of keys) {
    let currentLi = document.createElement("li");
    let currentItem = localStorage.getItem(key);
    currentLi.innerHTML = "<div>" + currentItem + "</div>";
    currentLi.id = key;
    document.getElementById("list").appendChild(currentLi);
    addRemoveButton(currentLi, key);
    addEditButton(currentLi, key);
  }
}

// add item to page, localstorage, and add key to array
function addListItem() {
  event.preventDefault();
  let newLi = document.createElement("li");
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    let currentKey = String(
      Number(keys.length) === 0 ? 1 : Number(keys[keys.length - 1]) + 1
    );
    // add item to local storage and key array
    localStorage.setItem(currentKey, textToAdd.value);
    keys.push(currentKey);

    // add item to page with an id and remove button
    newLi.innerHTML = "<div>" + textToAdd.value + "</div>";
    newLi.id = currentKey;
    document.getElementById("list").appendChild(newLi);
    addRemoveButton(newLi, currentKey);
    addEditButton(newLi, currentKey);
    // clear input box
    textToAdd.value= "";
  }
}

// remove item from page, localstorage, and remove key from array
function removeListItem(e) {
  let listItem = e.target.parentElement;
  localStorage.removeItem(listItem.id);
  keys = keys.filter((key) => key !== listItem.id);
  listItem.remove();
}

// add remove button to list item with event listener
function addRemoveButton(element, buttonNumber) {
  element.insertAdjacentHTML(
    "beforeend",
    `<button id='remove-button-${buttonNumber}' class='remove'>&Cross;</button>`
  );
  let removeButton = document.getElementById(`remove-button-${buttonNumber}`);
  removeButton.addEventListener("click", removeListItem);
}

// add edit button to list item with event listener
function addEditButton(element, buttonNumber) {
  element.insertAdjacentHTML(
    "beforeend",
    `<button id='edit-button-${buttonNumber}' class='edit'>&#128393;</button>`
  );
  let editButton = document.getElementById(`edit-button-${buttonNumber}`);
  editButton.addEventListener("click", editListItem);
}

// swap to save edit button and pass existing buttons to save edit handler
function swapToSaveEditButton(element, buttonNumber) {
  element.insertAdjacentHTML(
    "beforeend",
    `<button id='save-edit-button-${buttonNumber}' class='save-edit'>&#128427;</button>`
  );
  let saveEditButton = document.getElementById(`save-edit-button-${buttonNumber}`);
  let editButton = document.getElementById(`edit-button-${buttonNumber}`);
  let removeButton = document.getElementById(`remove-button-${buttonNumber}`);
  removeButton.parentElement.removeChild(removeButton);
  editButton.parentElement.replaceChild(saveEditButton, editButton);
  // pass event object and temporarily removed buttons to event handler
  saveEditButton.addEventListener("click", (e) => {
    let dataToPass = {"event": e, "args": [editButton, removeButton]};
    saveListItemEdit(dataToPass);
  });
}

// open input box with existing content to allow editing of content
function editListItem(e) {
  // store existing parent li, child text div, and text content
  let parentLi = e.target.parentElement;
  let childDiv = e.target.parentElement.firstElementChild;
  let currentText = e.target.parentElement.firstElementChild.textContent;

  // create and populate new input box for editing
  let editInputBox = document.createElement("input");
  editInputBox.value = currentText;

  // replace existing text div with editing input box, swap buttons
  parentLi.replaceChild(editInputBox, childDiv);
  editInputBox.focus();
  swapToSaveEditButton(parentLi, parentLi.id);
}

// handle saving of edited list item to page (TODO: and localstorage)
// along with swapping save edit button out for edit and remove buttons
function saveListItemEdit(dataToPass) {
  let editButton = dataToPass.args[0];
  let removeButton = dataToPass.args[1];

  // store existing parent li, child input box, text content, and button
  let parentLi = dataToPass.event.target.parentElement;
  let childInputBox = dataToPass.event.target.parentElement.firstElementChild;
  let edittedText = dataToPass.event.target.parentElement.firstElementChild.value;
  let saveEditButton = dataToPass.event.target.parentElement.lastElementChild;

  // create new div and populate with editted text content
  let newTextDiv = document.createElement("div");
  newTextDiv.textContent = edittedText;

  // swap input box for text div and save edit button for remove and edit buttons
  parentLi.replaceChild(newTextDiv, childInputBox);
  parentLi.removeChild(saveEditButton);
  parentLi.appendChild(removeButton);
  parentLi.appendChild(editButton);
}