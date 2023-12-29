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

  sortTitlesArray();
}

// make sure titles array is sorted based on preceding key values
function sortTitlesArray() {
  state.titles.sort((a, b) => {
    if (
      Number(a.substring(0, a.indexOf("_"))) <
      Number(b.substring(0, b.indexOf("_")))
    )
      return -1;
    if (
      Number(a.substring(0, a.indexOf("_"))) >
      Number(b.substring(0, b.indexOf("_")))
    )
      return 1;
    return 0;
  });
}

// the flag parameter represents which function the state is being updated from
// values is whatever other data is needed for that state context
function createLocalState(flag, ...values) {
  let localStateVars = [];

  if (flag === "addList") {
    localStateVars = [
      String(
        Number(
          state.titles.at(-1).substring(0, state.titles.at(-1).indexOf("_"))
        ) + 1
      ),
    ];
    localStateVars.push(`${localStateVars[0]}_New List`);
  }

  if (flag === "addNote") {
    localStateVars = [
      document.createElement("li"),
      String(state.currentList.length === 0 ? 0 : state.currentList.length),
    ];
  }

  if (flag === "removeList") {
    let nextTitle = DEFAULT_INITIAL_TITLE;
    if (state.titles.length > 1 && state.titles[0] !== state.currentTitle) {
      nextTitle = state.titles[0];
    }
    if (state.titles.length > 1 && state.titles[0] === state.currentTitle) {
      nextTitle = state.titles[1];
    }
    localStateVars = [
      nextTitle,
      nextTitle.substring(0, nextTitle.indexOf("_")),
      JSON.parse(localStorage.getItem(nextTitle)) || [],
    ];
  }

  if (flag === "changeList") {
    localStateVars = [state.titles.find((t) => t.startsWith(values[0]))];
    localStateVars.push(JSON.parse(localStorage.getItem(localStateVars[0])));
  }

  if (flag === "exitTextEditTitle") {
    localStateVars = [`${state.currentTitleKey}_${values[0]}`];
  }

  return localStateVars;
}

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

export { state, initializeState, createLocalState, updateState };
