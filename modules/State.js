const DEFAULT_INITIAL_TITLE = "0_My Thoughts";
let state = {
  titles: [],
  currentTitle: "",
  currentTitleKey: "",
  userFacingTitle: "",
  currentList: [],
};

function initializeState() {
  state.titles = Object.keys(localStorage);
  state.currentTitle =
    state.titles.find((t) => t.endsWith("_current")) || DEFAULT_INITIAL_TITLE;

  // remove current tag from currentTitle variable
  if (state.currentTitle.includes("_current")) {
    state.currentTitle = state.currentTitle.substring(
      0,
      state.currentTitle.lastIndexOf("_")
    );
  }
  // add first default title to titles array on first load
  if (state.titles.length === 0) state.titles.push(state.currentTitle);
  // remove current tag from titles array if present
  state.titles = state.titles.map((t) => {
    if (t.includes("_current")) return t.substring(0, t.lastIndexOf("_"));
    else return t;
  });

  state.currentTitleKey = state.currentTitle.substring(
    0,
    state.currentTitle.indexOf("_")
  );
  state.userFacingTitle = state.currentTitle.substring(
    state.currentTitle.indexOf("_") + 1
  );
  state.currentList =
    JSON.parse(localStorage.getItem(state.currentTitle.concat("_current"))) ||
    [];
}

// the flag parameter represents which function the state is being updated from
// function createLocalState(flag) {}

// the flag parameter represents which function the state is being updated from
// stateVars is the local variables to update the global state variables with
function updateState(flag, ...stateVars) {
  if (flag === "addList") {
    state.titles.push(stateVars[1]);
    state.currentTitle = stateVars[1];
    state.currentTitleKey = stateVars[0];
    state.userFacingTitle = stateVars[1].substring(
      stateVars[1].indexOf("_") + 1
    );
    state.currentList = [];
  }

  if (flag === "addNote") {
    state.currentList.push(stateVars[0]);
  }

  if (flag === "removeList") {
    state.userFacingTitle = stateVars[0].substring(
      stateVars[0].indexOf("_") + 1
    );
    state.titles.splice(state.titles.indexOf(state.currentTitle), 1);
    if (state.titles.length === 0) state.titles.push(stateVars[0]);
    state.currentTitle = stateVars[0];
    state.currentTitleKey = stateVars[1];
    state.currentList = stateVars[2];
  }

  if (flag === "removeNote") {
    state.currentList.splice(stateVars[0], 1, stateVars[1]);
  }

  if (flag === "changeList") {
    state.currentTitle = stateVars[0];
    state.currentTitleKey = stateVars[1];
    state.userFacingTitle = stateVars[0].substring(
      stateVars[0].indexOf("_") + 1
    );
    state.currentList = stateVars[2];
  }

  if (flag === "exitTextEditNote") {
    state.currentList.splice(stateVars[0], 1, stateVars[1]);
  }

  if (flag === "exitTextEditTitle") {
    state.titles.splice(
      state.titles.indexOf(state.currentTitle),
      1,
      stateVars[0]
    );
    state.currentTitle = stateVars[0];
    state.userFacingTitle = stateVars[1];
  }
}

export { DEFAULT_INITIAL_TITLE, state, initializeState, updateState };
