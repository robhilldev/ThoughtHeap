window.onload = function() {
  document.getElementById("text-to-add").value = "";
  instantiateList();
}

// create an instance of the list with items from localstorage
function instantiateList() {
  let keys = Object.keys(localStorage);
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
    // store new item in localstorage with item count as key
    incrementItemCount();
    localStorage.setItem(
      Number(localStorage.listItemCount),
      textToAdd.value
    );

    // add item to page with an id and remove button
    newLi.innerHTML = textToAdd.value;
    newLi.id = localStorage.listItemCount;
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
  localStorage.listItemCount = Number(localStorage.listItemCount) - 1;
}

// increment local storage item count to use as key
function incrementItemCount() {
  if (localStorage.listItemCount) {
    localStorage.listItemCount = Number(localStorage.listItemCount) + 1;
  }
  else {
    localStorage.listItemCount = 1
  }
}