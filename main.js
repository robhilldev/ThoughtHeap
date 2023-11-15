window.onload = function() {
  document.getElementById("text-to-add").value = "";

  let keys = Object.keys(localStorage);
  keys.sort();
  instantiateList(keys);

  let addButton = document.getElementById("form-button");
  addButton.addEventListener("click", addListItem.bind(keys));
}

// create an instance of the list with items from localstorage
function instantiateList(keys) {
  for (let key of keys) {
    let currentLi = document.createElement("li");
    let currentItem = localStorage.getItem(String(key));
    currentLi.innerHTML = currentItem;
    currentLi.id = key;
    currentLi.insertAdjacentHTML(
      "beforeend",
      " <button id='remove-button' onclick='removeListItem(event)'>-</button>"
    );
    document.getElementById("list").appendChild(currentLi);
  }
}

// add item to page
function addListItem() {
  let newLi = document.createElement("li");
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    event.preventDefault();
    let nextKey = Number(this.length) === 0 ? 1 : Number(this[this.length - 1]) + 1;
    localStorage.setItem(
      nextKey,
      textToAdd.value
    );
    this.push(nextKey);

    // add item to page with an id and remove button
    newLi.innerHTML = textToAdd.value;
    newLi.id = nextKey;
    newLi.insertAdjacentHTML(
      "beforeend",
      " <button id='remove-button' onclick='removeListItem(event)'>-</button>"
    );
    document.getElementById("list").appendChild(newLi);
    // clear input box
    textToAdd.value= "";
  }
}

// remove item from page and localstorage
function removeListItem(e) {
  let listItem = e.target.parentElement;
  localStorage.removeItem(String(listItem.id));
  listItem.remove();
}