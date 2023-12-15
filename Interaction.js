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

export { toggleListMenu, closeListMenu };