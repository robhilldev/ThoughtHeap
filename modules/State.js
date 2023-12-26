function initializeState(defaultInitialTitle) {
  let titles = Object.keys(localStorage);
  let currentTitle =
    titles.find((t) => t.endsWith("_current")) || defaultInitialTitle;

  // remove current tag from currentTitle variable
  if (currentTitle.includes("_current")) {
    currentTitle = currentTitle.substring(0, currentTitle.lastIndexOf("_"));
  }
  // add first default title to titles array on first load
  if (titles.length === 0) titles.push(currentTitle);
  // remove current tag from titles array if present
  titles = titles.map((t) => {
    if (t.includes("_current")) return t.substring(0, t.lastIndexOf("_"));
    else return t;
  });

  let currentTitleKey = currentTitle.substring(0, currentTitle.indexOf("_"));
  let userFacingTitle = currentTitle.substring(currentTitle.indexOf("_") + 1);
  let currentList =
    JSON.parse(localStorage.getItem(currentTitle.concat("_current"))) || [];

  return [titles, currentTitle, currentTitleKey, userFacingTitle, currentList];
}

// the flag argument represents which function the state is being updated from
// function updateState(flag, ...stateVars) {
//   let updatedValues;

//   if (/* flag 1 */) {/* update updatedValues */}
//   if (/* flag 2 */) {/* update updatedValues */}
//   if (/* flag 3 */) {/* update updatedValues */}
//   if (/* flag 4 */) {/* update updatedValues */}
//   if (/* flag 5 */) {/* update updatedValues */}

//   return updatedValues;
// }

export { initializeState };
