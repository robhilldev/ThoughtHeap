function addRemoveButton(buttonNumber) {
  let removeButton = document.createElement("button");
  removeButton.id = `remove-button-${buttonNumber}`;
  removeButton.className = "remove";
  removeButton.innerHTML = "&Cross;";
  return removeButton;
}

function addEditButton(buttonNumber) {
  let editButton = document.createElement("button");
  editButton.id = `edit-button-${buttonNumber}`;
  editButton.className = "edit";
  editButton.innerHTML = "&#9881;";
  return editButton;
}

function swapToSaveEditButton(buttonNumber) {
  let saveEditButton = document.createElement("button");
  saveEditButton.id = `save-edit-button-${buttonNumber}`;
  saveEditButton.className = "save-edit";
  saveEditButton.innerHTML = "&check;";

  let editButton = document.getElementById(`edit-button-${buttonNumber}`);
  let removeButton = document.getElementById(`remove-button-${buttonNumber}`);

  removeButton.parentElement.removeChild(removeButton);
  editButton.parentElement.replaceChild(saveEditButton, editButton);

  return [saveEditButton, editButton, removeButton];
}

export { addRemoveButton, addEditButton, swapToSaveEditButton };