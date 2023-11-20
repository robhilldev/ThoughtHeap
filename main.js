let keys = Object.keys(localStorage);

window.onload = function() {
  document.getElementById("text-to-add").value = "";

  keys.sort();
  instantiateList(keys);

  let addButton = document.getElementById("form-button");
  addButton.addEventListener("click", addListItem);
}

// create an instance of the list with items from localstorage
function instantiateList(keys) {
  for (let key of keys) {
    let currentLi = document.createElement("li");
    let currentItem = localStorage.getItem(key);
    currentLi.innerHTML = currentItem;
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
    newLi.innerHTML = textToAdd.value;
    newLi.id = currentKey;
    document.getElementById("list").appendChild(newLi);
    addRemoveButton(newLi, currentKey);
    addEditButton(newLi, currentKey);
    // clear input box
    textToAdd.value= "";
  }
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
  //editButton.addEventListener("click", editListItem);
}

// remove item from page, localstorage, and remove key from array
function removeListItem(e) {
  let listItem = e.target.parentElement;
  localStorage.removeItem(listItem.id);
  keys = keys.filter((key) => key !== listItem.id);
  listItem.remove();
}

// open input box with existing content in li, allow editing of content,
// then allow saving new content
// function editListItem(e) {}