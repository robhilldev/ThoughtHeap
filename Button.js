function addRemoveButton(buttonNumber) {
  let removeButton = document.createElement("button");
  removeButton.id = `remove-button-${buttonNumber}`;
  removeButton.className = "remove";
  removeButton.type = "button";
  removeButton.ariaLabel = `remove-button-${buttonNumber}`;

  return removeButton;
}

function addEditButton(buttonNumber) {
  let editButton = document.createElement("button");
  editButton.id = `edit-button-${buttonNumber}`;
  editButton.className = "edit";
  editButton.type = "button";
  editButton.ariaLabel = `edit-button-${buttonNumber}`;

  return editButton;
}

function swapToEditButtons(buttonNumber) {
  let saveEditButton = document.createElement("button");
  saveEditButton.id = `save-edit-button-${buttonNumber}`;
  saveEditButton.className = "save-edit";
  saveEditButton.type = "button";

  let discardEditButton = document.createElement("button");
  discardEditButton.id = `discard-edit-button-${buttonNumber}`;
  discardEditButton.className = "discard-edit";
  discardEditButton.type = "button";

  let editButton = document.getElementById(`edit-button-${buttonNumber}`);
  let removeButton = document.getElementById(`remove-button-${buttonNumber}`);
  
  editButton.parentElement.replaceChild(discardEditButton, removeButton);
  editButton.parentElement.replaceChild(saveEditButton, editButton);

  return [discardEditButton, saveEditButton, editButton, removeButton];
}

export { addRemoveButton, addEditButton, swapToEditButtons };
