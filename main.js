// vvv TODO vvv
// initialize list with items in localstorage
// const initializeList = () => {}

// add list item to page and localstorage
const addListItem = () => {
  let newLi = document.createElement("li");
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    // prevent page refresh on every list item add
    event.preventDefault();

    // store new list item in localstorage
    // make list item persist on browser refresh or restart
    if (localStorage.listItemCount) {
      localStorage.listItemCount = Number(localStorage.listItemCount) + 1;
    }
    else {
      localStorage.listItemCount = 1
    }
    localStorage.setItem(
      JSON.stringify(localStorage.listItemCount),
      textToAdd.value
    );

    // add list item to page with a remove button
    newLi.innerHTML = textToAdd.value;
    newLi.insertAdjacentHTML(
      "beforeend",
      " <button id='remove-button' onclick='this.parentElement.remove()'>-</button>"
    );
    document.getElementById("list").appendChild(newLi);
    // clear input box
    textToAdd.value= "";
  }
}

// vvv TODO vvv
// remove list item from page and localstorage
// const removeListItem = () => {}