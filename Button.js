function addRemoveButton(buttonNumber) {
  let removeButton = document.createElement("button");
  removeButton.id = `remove-button-${buttonNumber}`;
  removeButton.className = "remove";
  removeButton.type = "button";
  removeButton.innerHTML = "&#128465;";
  return removeButton;
}

function addEditButton(buttonNumber) {
  let editButton = document.createElement("button");
  editButton.id = `edit-button-${buttonNumber}`;
  editButton.className = "edit";
  editButton.type = "button";
  editButton.innerHTML = "&#8230;";
  return editButton;
}

function swapToEditButtons(buttonNumber) {
  let saveEditButton = document.createElement("button");
  saveEditButton.id = `save-edit-button-${buttonNumber}`;
  saveEditButton.className = "save-edit";
  saveEditButton.type = "button";
  saveEditButton.innerHTML = "&#10003;";

  let discardEditButton = document.createElement("button");
  discardEditButton.id = `discard-edit-button-${buttonNumber}`;
  discardEditButton.className = "discard-edit";
  discardEditButton.type = "button";
  discardEditButton.innerHTML = "&#10007;";

  let editButton = document.getElementById(`edit-button-${buttonNumber}`);
  if (editButton.parentElement.tagName === "LI") {
    let removeButton = document.getElementById(`remove-button-${buttonNumber}`);
    editButton.parentElement.replaceChild(discardEditButton, removeButton);
    editButton.parentElement.replaceChild(saveEditButton, editButton);
    return [discardEditButton, saveEditButton, editButton, removeButton];
  } else if (editButton.parentElement.tagName === "HEADER") {
    let removeButton = document.createElement("button");
    editButton.parentElement.appendChild(discardEditButton);
    editButton.parentElement.replaceChild(saveEditButton, editButton);
    return [discardEditButton, saveEditButton, editButton, removeButton];
  }
}

export { addRemoveButton, addEditButton, swapToEditButtons };