import arrowCreate from "arrows-svg";

const classfrom = document.querySelectorAll(`.from`);
const classTo = document.querySelectorAll(`.to`);
const taskManager = document.querySelector(`.task-manager`);

const taskListClose = document.querySelector(`.task-list__close`);
const taskListOpen = document.querySelector(`.task-list__open`);
const taskList = document.querySelector(`.task-list`);
const list = taskList.querySelector(`.list`);

const Add = document.querySelector(`.add`);
const Close = document.querySelector(`.close`);
const options = document.querySelector(`.options`);
const create = document.querySelector(`.options__OK`);
const createTask = document.querySelector(`.options__task`);
const optionsTime = document.querySelector(`.options__time`);
const optionsDate = document.querySelector(`.options__date`);
const selectTask = document.getElementById(`selectTask`);

const optionsEditor = document.querySelector(`.options-editor`);
const edit = document.querySelector(`.options-editor__OK`);
const editTaskInput = document.querySelector(`.options-editor__task`);

const colorText = document.querySelector(`.options__color-text`);
const colorBg = document.querySelector(`.options__color-bg`);

const colorTextEdit = document.querySelector(`.options-editor__color-text`);
const colorBgEdit = document.querySelector(`.options-editor__color-bg`);

const save = document.querySelector(`.save`);
const load = document.querySelector(`.load`);

function openTaskList() {
  taskList.classList.remove(`task-list-hidden`);
  taskList.classList.add(`task-list-show`);
  taskListOpen.style.display = `none`;
  taskListClose.style.display = `block`;
  list.style.display = `block`;
}
function closeTaskList() {
  taskList.classList.add(`task-list-hidden`);
  taskList.classList.remove(`task-list-show`);
  taskListClose.style.display = `none`;
  taskListOpen.style.display = `block`;
  list.style.display = `none`;
}
// closeTaskList();

taskListOpen.addEventListener(`click`, (e) => {
  openTaskList();
});

taskListClose.addEventListener(`click`, (e) => {
  closeTaskList();
});

function showCreate() {
  options.classList.remove(`hide`);

  Add.classList.add(`hide`);

  Close.classList.remove(`hide`);
  Close.classList.add(`animсlose`);

  options.classList.remove(`options-hide`);
  options.classList.add(`options-show`);
}

function hideCreate() {
  Close.classList.add(`hide`);

  Add.classList.remove(`hide`);
  Add.classList.add(`animadd`);

  options.classList.remove(`options-show`);
  options.classList.add(`options-hide`);
}

colorText.addEventListener(`change`, (e) => {
  createTask.style.color = colorText.value;
});

colorBg.addEventListener(`change`, () => {
  createTask.style.backgroundColor = colorBg.value;
});

function color() {
  abstractArr.forEach((item) => {
    let elem = document.getElementById(item.id);
    elem = elem.querySelector(`.abstractTask`);
    console.log(elem);
    elem.style.color = item.colorText;
    elem.style.backgroundColor = item.colorBg;
  });
}

selectTask.addEventListener(`change`, (e) => {
  if (e.target.checked) {
    optionsTime.classList.remove(`hide`);
    let d = new Date();
    let d2 = new Date(d.getTime() + 3600000);
    let year = d2.getFullYear();
    let month = d2.getMonth() + 1;
    let day = d2.getDate();
    let hours = d2.getHours();
    let minutes = d2.getMinutes();
    let seconds = d2.getSeconds();
    optionsDate.value = `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  } else {
    optionsTime.classList.add(`hide`);
  }
});

Add.addEventListener(`click`, (e) => {
  showCreate();
});
Close.addEventListener(`click`, (e) => {
  hideCreate();
});

let abstractArr = [];
let abstractId = [];
let arrowLinks = {};
let allArrows = []; //для очистки стрелок
class Abstract {
  constructor(task, colorBg, colorText, id = -1, x = 0, y = 0) {
    this.type = 0;
    this.task = task;
    this.x = x;
    this.y = y;
    this.countDone = 0;
    this.colorBg = colorBg;
    this.colorText = colorText;

    if (id == -1) {
      this.id = this.newId();
    } else {
      this.id = id;
    }

    this.abstract();

    this.idParent = this.id;
    this.idChild = -1;
  }

  abstract() {
    let elem = `
    <div class="abstract" id="${this.id}">
      <div class="per">25%</div>
      <div draggable="true" class="abstractTask">${this.task}</div>
      <div class="addAbstractWrapper">
          <div class="addAbstract">+</div>
          <div class="deleteAbstract">-</div>
      </div>
    </div>
  `;
    taskManager.innerHTML += elem;
    this.checkClick();
    this.pos();
  }

  pos() {
    let elem = document.getElementById(this.id);
    elem.style.top = this.y + `px`;
    elem.style.left = this.x + `px`;
  }

  checkClick() {
    document.addEventListener(`click`, (e) => {
      let target = e.target;
      if (
        target.classList.contains(`deleteAbstract`) &&
        target.parentNode.parentNode.id == this.id
      ) {
        this.delete();
      }
    });
  }

  delete() {
    document.getElementById(this.id).remove();
    this.deleteTask();
    abstractArr.forEach((item, i) => {
      if (item.id === this.id) {
        abstractArr.splice(i, 1);
        deleteArrow(this.id + ``);
        clearArrows();
        createArrowLinks();
      }
    });
  }

  deleteTask() {
    let task = document.querySelectorAll(`.list__done`);
    task.forEach((item) => {
      if (item.classList.contains(this.id)) {
        item.parentNode.remove();
      }
    });
  }

  newId() {
    let newId;
    if (abstractId.length == 0) {
      newId = 0;
    } else {
      newId = abstractId[abstractId.length - 1] + 1;
    }
    abstractId.push(newId);
    return newId;
  }
}

class Task extends Abstract {
  constructor(task, colorBg, colorText, id, x, y, deadline, done = false) {
    super(task, colorBg, colorText, id, x, y);
    this.type = 1;
    this.done = done;
    this.deadline = deadline;

    this.exactAnim();
  }

  abstract() {
    let elem = `
    
    <div class="abstract" id="${this.id}">
<div draggable="true" class="abstractTask exact">
<span class="exactAnim"></span>
${this.task}
</div>
      <div class="addAbstractWrapper">
          <div class="addAbstract">+</div>
           <div class="deleteAbstract">-</div>
      </div>
    </div>
  `;
    taskManager.innerHTML += elem;
    this.checkClick();
    this.pos();
  }

  exactAnim() {
    const exact = document.querySelectorAll(`.exact`);
    exact.forEach((item) => {
      const exactAnim = item.children[0];
      exactAnim.style.width = getComputedStyle(item).width;
      exactAnim.style.height = getComputedStyle(item).height;
    });
  }

  // addTaskInTasklist() {
  //   let elem = `
  //   <div class="list__wrapper">
  //     <div class="list__task-wrapper">
  //       <div class="list__task ">${this.task}</div>

  //       <div class="time">
  //       Время
  //       <div class="timer timer__days">00</div>
  //             <div class="timer timer__hours">00</div>
  //             <div class="timer timer__minutes">00</div>
  //             <div class="timer timer__seconds">00</div>
  //       </div>
  //     </div>

  //     <div class="complete hide">Готово</div>
  //     <input class="list__done ${this.id}" type="checkbox" />
  //   </div>
  //   `;
  //   list.innerHTML += elem;
  // }
}
taskList.addEventListener(`change`, (e) => {
  if (e.target.classList.contains(`list__done`)) {
    if (e.target.checked) {
      abstractArr.forEach((item) => {
        if (item.id == e.target.classList[1]) {
          item.done = true;
          change();
          abstractDone();
        }
      });
    } else {
      abstractArr.forEach((item) => {
        if (item.id == e.target.classList[1]) {
          item.done = false;
          change();
          abstractDone();
        }
      });
    }
  }
});

function check() {
  let checkboxes = document.querySelectorAll(`.list__done`);

  checkboxes.forEach((box) => {
    abstractArr.forEach((item) => {
      if (
        item.done == true &&
        box.classList[1] == item.id &&
        item.done != undefined
      ) {
        box.checked = true;
      } else if (
        item.done == false &&
        box.classList[1] == item.id &&
        item.done != undefined
      ) {
        box.checked = false;
      }
    });
  });
}

function change() {
  abstractArr.forEach((item) => {
    let elem = document.getElementById(item.id);
    if (item.done != undefined) {
      if (item.done) {
        elem.childNodes[1].childNodes[1].classList.remove(`exactAnim`);
        elem.childNodes[1].classList.add(`done`);
      } else {
        elem.childNodes[1].classList.remove(`done`);
        elem.childNodes[1].childNodes[1].classList.add(`exactAnim`);
      }
    }
  });
}

function getTime(deadline) {
  let t = new Date(deadline) - Date.parse(new Date());
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}

function showTime() {
  let elemIds = document.querySelectorAll(`.list__done`);
  abstractArr.forEach((item) => {
    elemIds.forEach((elemId) => {
      let elem = elemId.parentNode.childNodes[1].childNodes[3];
      let complete = elemId.parentNode.childNodes[1].nextSibling.nextSibling;
      if (elemId.checked) {
        elem.classList.add(`hide`);
        complete.classList.remove(`hide`);
      } else {
        if (item.id == elemId.classList[1]) {
          elem.classList.remove(`hide`);
          complete.classList.add(`hide`);
          let dt = getTime(item.deadline);
          let days = elem.childNodes[1];
          let hours = elem.childNodes[3];
          let minutes = elem.childNodes[5];
          let seconds = elem.childNodes[7];
          if (dt.total < 0) {
            days.textContent = dt.days + 1 + `d`;
            hours.textContent = dt.hours + 1 + `h`;
            minutes.textContent = dt.minutes + 1 + `m`;
            seconds.textContent = dt.seconds + `s`;
          } else {
            days.textContent = dt.days + `d`;
            hours.textContent = dt.hours + `h`;
            minutes.textContent = dt.minutes + `m`;
            seconds.textContent = dt.seconds + `s`;
          }
        }
      }
    });
  });
}

setInterval(showTime, 1000);

function sort() {
  abstractArr.sort((a, b) => {
    if (a.type > b.type) {
      return 1;
    } else {
      return -1;
    }
  });

  abstractArr.sort((a, b) => {
    let d1 = new Date(a.deadline) - new Date();
    let d2 = new Date(b.deadline) - new Date();
    if (d1 > d2) {
      return 1;
    } else {
      return -1;
    }
  });

  list.innerHTML = `Сортировка..`;
  list.innerHTML = ``;
  abstractArr.forEach((item) => {
    if (item.type == 1) {
      let elem = `
      <div class="list__wrapper">
        <div class="list__task-wrapper">
          <div class="list__task ">${item.task}</div>
          
          <div class="time">
          Время
          <div class="timer timer__days">00</div>
                <div class="timer timer__hours">00</div>
                <div class="timer timer__minutes">00</div>
                <div class="timer timer__seconds">00</div>
          </div>
        </div>
  
        <div class="complete hide">Готово</div>
        <input class="list__done ${item.id}" type="checkbox" />
      </div>
      `;
      list.innerHTML += elem;
    }
  });
}

////////////////////////////////////////////////////////////////

let mouseY;
let mouseX;
document.addEventListener(`mousedown`, (e) => {
  mouseY = e.offsetY;
  mouseX = e.offsetX;
});

let t;
let tChild;
let taskID;
document.addEventListener(`dragstart`, (e) => {
  t = e.target;
  try {
    if (t.classList.contains(`abstractTask`)) {
      e.dataTransfer.setData(`text/html`, `dragstart`);
      taskID = `abstract`;
      if (t.classList.contains(`exact`)) {
        taskID = t.classList[1];
      }
    }
  } catch (err) {
    e.preventDefault();
  }
});

document.addEventListener(`dragend`, (e) => {
  let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
  if (taskID != `exact`) {
    if (elemBelow != null && elemBelow.classList.contains(`wrapper`)) {
      t.parentNode.style.top = e.pageY - mouseY + `px`;
      t.parentNode.style.left = e.pageX - mouseX + `px`;
      abstractArr.forEach((item) => {
        if (item.id == t.parentNode.id) {
          item.y = e.pageY - mouseY;
          item.x = e.pageX - mouseX;
        }
      });
    } else if (elemBelow != null) {
      addArrow();
      t = undefined;
    }
  } else if (elemBelow != null && elemBelow.classList.contains(`wrapper`)) {
    t.parentNode.style.top = e.pageY - mouseY + `px`;
    t.parentNode.style.left = e.pageX - mouseX + `px`;
    abstractArr.forEach((item) => {
      if (item.id == t.parentNode.id) {
        item.y = e.pageY - mouseY;
        item.x = e.pageX - mouseX;
      }
    });
  }
});

document.addEventListener(`dragenter`, (e) => {
  if (
    e.target.classList.contains(`abstractTask`) &&
    e.target.parentNode.id != t
  ) {
    tChild = e.target.parentNode.id;
  }
});

let elem;
let elemId;
let elemText;
document.addEventListener(`dblclick`, (e) => {
  if (e.target.classList.contains(`abstractTask`)) {
    elem = e.target;
    elemId = e.target.parentNode.id;
    elemText = e.target.textContent;
    editTaskInput.value = elemText;
    optionsEditor.classList.remove(`hide`);
    optionsEditor.classList.remove(`options-editor-hide`);
    optionsEditor.classList.add(`options-editor-show`);
  }
});

edit.addEventListener(`click`, (e) => {
  editTask(elemId, editTaskInput.value);

  optionsEditor.classList.add(`options-editor-hide`);
  optionsEditor.classList.remove(`options-editor-show`);
});

function editTask(id, task) {
  abstractArr.forEach((item) => {
    if (item.id == id) {
      item.colorBg = colorBgEdit.value;
      item.colorText = colorTextEdit.value;
      elem.style.backgroundColor = item.colorBg;
      elem.style.color = item.colorText;

      item.task = task;
      elem.textContent = task;
      if (item.type == 1) {
        elem.innerHTML = `
<span class="exactAnim"></span>
${task}
`;
        item.exactAnim();
      }
    }
  });
  console.log(abstractArr);
}

function updateProgress(id, value) {
  abstractArr.forEach((item) => {
    if (item.id == id) {
      item.countDone += value;
      let thisValue = value / arrowLinks[item.id].childs.size;
      for (let parent of arrowLinks[item.id].parents) {
        updateProgress(parent, thisValue);
      }
    }
  });
}

function abstractDone() {
  abstractArr.forEach((item) => {
    if (item.done != undefined && item.done) {
      for (let parent of arrowLinks[item.id].parents) {
        updateProgress(parent, 1);
      }
    }
  });

  abstractArr.forEach((item) => {
    if (item.done == undefined) {
      if (arrowLinks[item.id].childs.size != 0) {
        let per = (item.countDone / arrowLinks[item.id].childs.size) * 100;
        let elem = document.getElementById(item.id);
        elem.childNodes[1].style.display = `block`;
        elem.childNodes[1].textContent = per + `%`;
        item.countDone = 0;
      }
    }
  });
}

function addArrow() {
  if (tChild != undefined && t.parentNode.id != tChild) {
    if (arrowLinks[t.parentNode.id] == undefined) {
      arrowLinks[t.parentNode.id] = {
        parents: new Set(),
        childs: new Set(),
      };
    }
    if (arrowLinks[tChild] == undefined) {
      arrowLinks[tChild] = {
        parents: new Set(),
        childs: new Set(),
      };
    }

    arrowLinks[tChild].parents.add(t.parentNode.id);
    arrowLinks[t.parentNode.id].childs.add(tChild);

    createArrowLinks();
  }
}

function createArrowLinks() {
  clearArrows();
  for (let parent in arrowLinks) {
    arrowLinks[parent].childs.forEach((child) => {
      const arrow = arrowCreate({
        from: document.getElementById(parent),
        to: document.getElementById(child),
      });
      document.body.appendChild(arrow.node);

      allArrows.push(arrow);
      abstractDone();
    });
  }
}

function clearArrows() {
  allArrows.forEach((arrow) => {
    arrow.clear();
  });
  allArrows = [];
}

function deleteArrow(id) {
  delete arrowLinks[id];

  for (let key in arrowLinks) {
    arrowLinks[key].childs.delete(id);
  }
}

////////////////////////////////////////////////////////////////

create.addEventListener(`click`, (e) => {
  let task = createTask.value;
  let time = optionsDate.value;
  if (task != ``) {
    addAbstract(colorBg.value, colorText.value, task, time);
    createTask.value = ``;
  }
});

function addAbstract(
  colorBg,
  colorText,
  task,
  deadline,
  id,
  x,
  y,
  done,
  type = -1
) {
  const selectTask = document.getElementById(`selectTask`);
  if ((selectTask.checked && type == -1) || type == 1) {
    abstractArr.push(
      new Task(task, colorBg, colorText, id, x, y, deadline, done)
    );
  } else {
    abstractArr.push(new Abstract(task, colorBg, colorText, id, x, y));
  }

  if (arrowLinks[abstractArr[abstractArr.length - 1].id] == undefined) {
    arrowLinks[abstractArr[abstractArr.length - 1].id] = {
      parents: new Set(),
      childs: new Set(),
    };
  }
  if (arrowLinks[abstractArr[abstractArr.length - 1].id] == undefined) {
    arrowLinks[abstractArr[abstractArr.length - 1].id] = {
      parents: new Set(),
      childs: new Set(),
    };
  }
  check();
  change();
  showTime();
  color();
  sort();
  console.log(abstractArr);
}

save.addEventListener(`click`, () => {
  savelocal();
});

load.addEventListener(`click`, () => {
  loadlocal();
});

function savelocal() {
  let arrowLinksClone = {};
  for (let key in arrowLinks) {
    arrowLinksClone[key] = {};
    arrowLinksClone[key].parents = Array.from(arrowLinks[key].parents);
    arrowLinksClone[key].childs = Array.from(arrowLinks[key].childs);
  }
  localStorage.abstractArr = JSON.stringify(abstractArr);
  localStorage.abstractId = JSON.stringify(abstractId);
  localStorage.arrowLinksClone = JSON.stringify(arrowLinksClone);
}

function loadlocal() {
  let localAbstractArr = JSON.parse(localStorage.abstractArr);
  abstractId = JSON.parse(localStorage.abstractId);
  let newArrowLinks = {};
  newArrowLinks = JSON.parse(localStorage.arrowLinksClone);

  for (let key in newArrowLinks) {
    newArrowLinks[key].parents = new Set(newArrowLinks[key].parents);
    newArrowLinks[key].childs = new Set(newArrowLinks[key].childs);
  }
  arrowLinks = newArrowLinks;
  localAbstractArr.forEach((item) => {
    addAbstract(
      item.colorBg,
      item.colorText,
      item.task,
      item.deadline,
      item.id,
      item.x,
      item.y,
      item.done,
      item.type
    );
  });
  createArrowLinks();
}
