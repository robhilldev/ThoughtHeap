// open or close the list selection menu when clicking its button
function toggleListMenu() {
  const menu = document.getElementById("list-select-content");
  const titleRightEdge = document
    .getElementsByTagName("header")[0]
    .children[0].getBoundingClientRect().right;
  const menuButtonLeftEdge = document
    .getElementsByTagName("header")[0]
    .children[1].getBoundingClientRect().left;

  // before opening menu determine its size and position
  if (!menu.classList.contains("visible")) {
    menu.style.width = `${titleRightEdge - menuButtonLeftEdge}px`;

    // and close an open title edit box before opening menu
    const headerChild = document.getElementById("header").firstElementChild;
    if (headerChild.classList.contains("edit-input-box")) {
      document.getElementById("discard-edit-button-header").click();
    }
  }

  menu.classList.toggle("visible");
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
