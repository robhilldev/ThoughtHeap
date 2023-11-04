const addListItem = () => {
  let newLi = document.createElement("li");
  let textToAdd = document.getElementById("text-to-add");
  
  if (textToAdd.value) {
    event.preventDefault();
    newLi.innerHTML = textToAdd.value;
    newLi.insertAdjacentHTML(
      "beforeend",
      " <button id='remove-button' onclick='this.parentElement.remove()'>-</button>"
    );
    document.getElementById("list").appendChild(newLi);
    // vvv TODO vvv
    // localStorage.setItem();
    textToAdd.value= "";
  }
}