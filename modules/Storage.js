function updateStorage(flag, currentTitle, ...data) {
  if (flag === "addList") {
    localStorage.setItem(currentTitle, JSON.stringify(data[0]));
    localStorage.removeItem(`${currentTitle}_current`);
    localStorage.setItem(`${data[1]}_current`, "[]");
  }

  if (flag === "addNote") {
    localStorage.setItem(`${currentTitle}_current`, JSON.stringify(data[0]));
  }

  if (flag === "removeList") {
    localStorage.removeItem(`${currentTitle}_current`);
    if (localStorage.getItem(data[0])) {
      localStorage.setItem(`${data[0]}_current`, JSON.stringify(data[1]));
      localStorage.removeItem(data[0]);
    }
  }

  if (flag === "removeNote") {
    localStorage.setItem(`${currentTitle}_current`, JSON.stringify(data[0]));
  }

  if (flag === "changeList") {
    localStorage.setItem(`${data[1]}_current`, JSON.stringify(data[2]));
    localStorage.removeItem(data[1]);
    localStorage.setItem(currentTitle, JSON.stringify(data[0]));
    localStorage.removeItem(`${currentTitle}_current`);
  }

  if (flag === "exitTextEditNote") {
    localStorage.setItem(`${currentTitle}_current`, JSON.stringify(data[0]));
  }

  if (flag === "exitTextEditTitle") {
    localStorage.setItem(`${data[1]}_current`, JSON.stringify(data[0]));
    if (data[1] !== currentTitle) {
      localStorage.removeItem(`${currentTitle}_current`);
    }
  }
}

export { updateStorage };
