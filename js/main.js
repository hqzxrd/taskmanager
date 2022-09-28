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
const optionsTask = document.querySelector(`.options__task`);

const optionsEditor = document.querySelector(`.options-editor`);
const edit = document.querySelector(`.options-editor__OK`);
const editTask = document.querySelector(`.options-editor__task`);

const colorText = document.querySelector(`.options__color-text`);
const colorBg = document.querySelector(`.options__color-bg`);

const colorTextEdit = document.querySelector(`.options-editor__color-text`);
const colorBgEdit = document.querySelector(`.options-editor__color-bg`);

taskListOpen.addEventListener(`click`, (e) => {
  taskList.classList.remove(`task-list-hidden`);
  taskList.classList.add(`task-list-show`);
  taskListOpen.style.display = `none`;
  taskListClose.style.display = `block`;
  list.style.display = `block`;
});

taskListClose.addEventListener(`click`, (e) => {
  taskList.classList.add(`task-list-hidden`);
  taskList.classList.remove(`task-list-show`);
  taskListClose.style.display = `none`;
  taskListOpen.style.display = `block`;
  list.style.display = `none`;
});

let pageY;
let pageX;

create.addEventListener(`click`, (e) => {
  let bgColor = colorBg.getAttribute(`data-current-color`);
  let txtColor = colorText.getAttribute(`data-current-color`);
  if (optionsTask.value != ``) {
    addAbstract(pageY + 150, pageX, optionsTask.value, bgColor, txtColor);
    grab();
    optionsTask.value = ``;
  }
});

function detect() {
  let id;
  const deleteAbstract = document.querySelectorAll(`.deleteAbstract`);
  deleteAbstract.forEach((item, i) => {
    item.addEventListener(`click`, (e) => {
      id = e.target.parentNode.parentNode.id;
      removeAbstract(id);
    });
  });
}

colorBg.addEventListener(`change`, (e) => {
  optionsTask.style.background = `${e.target.getAttribute(
    `data-current-color`
  )}`;
});

colorText.addEventListener(`change`, (e) => {
  optionsTask.style.color = `${e.target.getAttribute(`data-current-color`)}`;
});

colorBgEdit.addEventListener(`change`, (e) => {
  editTask.style.background = `${e.target.getAttribute(`data-current-color`)}`;
});

colorTextEdit.addEventListener(`change`, (e) => {
  editTask.style.color = `${e.target.getAttribute(`data-current-color`)}`;
});

let elemId;
edit.addEventListener(`click`, (e) => {
  let bgColor = colorBgEdit.getAttribute(`data-current-color`);
  let txtColor = colorTextEdit.getAttribute(`data-current-color`);

  optionsEditor.classList.remove(`options-editor-show`);
  optionsEditor.classList.add(`options-editor-hide`);

  editAbstract(elemId, editTask.value, bgColor, txtColor);
  editTask.value = ``;
});

document.addEventListener(`mousemove`, (e) => {
  pageY = e.clientY;
  pageX = e.clientX;
});
document.addEventListener(`keydown`, (e) => {
  let bgColor = colorBg.getAttribute(`data-current-color`);
  let txtColor = colorText.getAttribute(`data-current-color`);
  if (e.code == `Enter`) {
    if (optionsTask.value != ``) {
      addAbstract(pageY + 150, pageX, optionsTask.value, bgColor, txtColor);
      grab();
      optionsTask.value = ``;
    }
  }
});

Add.addEventListener(`click`, (e) => {
  options.classList.remove(`hide`);

  Add.classList.add(`hide`);

  Close.classList.remove(`hide`);
  Close.classList.add(`animсlose`);

  options.classList.remove(`options-hide`);
  options.classList.add(`options-show`);
});

Close.addEventListener(`click`, (e) => {
  Close.classList.add(`hide`);

  Add.classList.remove(`hide`);
  Add.classList.add(`animadd`);

  options.classList.remove(`options-show`);
  options.classList.add(`options-hide`);
});

taskManager.addEventListener(`click`, (e) => {
  const target = e.target;
  if (target.classList.contains(`addAbstract`)) {
    addAbstract(e.pageY + 50, e.pageX - 130);
    grab();
  }
});

let abstractArr = [];
let idsArr = [];
let allArrows = [];
let abstractArrow = {};
let idParent;
let idChild;
function grab() {
  const abstract = document.querySelectorAll(`.abstract`);

  abstract.forEach((item, i) => {
    let mouseY;
    let mouseX;

    item.addEventListener(`mousedown`, (e) => {
      mouseY = e.offsetY;
      mouseX = e.offsetX;
    });

    item.addEventListener(`dragstart`, (e) => {
      idParent = item.id;
      e.dataTransfer.setData(`text/html`, `dragstart`);
    });

    item.addEventListener(`dragend`, (e) => {
      let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
      if (elemBelow.classList.contains(`wrapper`)) {
        item.style.top = e.pageY - mouseY + `px`;
        item.style.left = e.pageX - mouseX + `px`;
        let targetIndex = idsArr.indexOf(+item.id);
        abstractArr[targetIndex][1] = e.pageY - mouseY;
        abstractArr[targetIndex][2] = e.pageX - mouseX;
        idParent = undefined;
        idChild = undefined;
      } else if (elemBelow.classList.contains(`abstractTask`)) {
        arrows();
      }
    });

    item.addEventListener(`dblclick`, (e) => {
      elemId = e.target.parentNode.id;
      let elemText = e.target.textContent;
      editTask.value = elemText;
      optionsEditor.classList.remove(`hide`);
      optionsEditor.classList.remove(`options-editor-hide`);
      optionsEditor.classList.add(`options-editor-show`);
    });
  });

  abstract.forEach((item, i) => {
    item.addEventListener(`dragenter`, (e) => {
      if (item.id != idParent) {
        idChild = item.id;
      }
    });
  });
}
grab();

function addAbstract(top, left, task, bgColor, textColor) {
  let newId;
  if (idsArr.length == 0) {
    newId = 0;
  } else {
    newId = idsArr[idsArr.length - 1] + 1;
  }
  taskManager.innerHTML += `
    <div class="abstract" id="${newId}">
      <div draggable="true" class="abstractTask">${task}</div>
      <div class="addAbstractWrapper">
          <div class="addAbstract">+</div>
          <div class="deleteAbstract">-</div>
      </div>
    </div>
  `;

  let elem = document.getElementById(newId);
  let abstractTask = elem.querySelector(`.abstractTask`);
  elem.style.top = top + `px`;
  elem.style.left = left + `px`;
  abstractArr.push([
    elem,
    elem.getBoundingClientRect().top,
    elem.getBoundingClientRect().left,
    bgColor,
    textColor,
  ]);
  idsArr.push(newId);
  abstractTask.style.background = abstractArr[abstractArr.length - 1][3];
  abstractTask.style.color = abstractArr[abstractArr.length - 1][4];
  detect();
}

function editAbstract(elemId, editTask, bgColor, txtColor) {
  let elem = document.getElementById(elemId);

  elem.childNodes[1].textContent = `${editTask}`;
  abstractArr[elemId - 1][3] = bgColor;
  abstractArr[elemId - 1][4] = txtColor;
  elem.childNodes[1].style.background = abstractArr[elemId - 1][3];
  elem.childNodes[1].style.color = abstractArr[elemId - 1][4];
  abstractArr[elemId - 1][0] = elem;
}

function arrows() {
  allArrows.forEach((arrow) => {
    arrow.clear();
  });
  if (idParent != undefined && idChild != undefined && idParent != idChild) {
    if (abstractArrow[idParent] == undefined) {
      abstractArrow[idParent] = new Set();
    }
    abstractArrow[idParent].add(idChild);

    // allArrows.forEach((arrow) => {
    //   arrow.clear();
    // });
    allArrows = [];
    console.log(`аровсы do`, abstractArrow);
    Object.keys(abstractArrow).forEach((key, i) => {
      abstractArrow[key].forEach((child) => {
        let keyExists = idsArr.indexOf(+key);
        let childExists = idsArr.indexOf(+child);
        if (keyExists != -1 && childExists != -1) {
          const arrow = arrowCreate({
            from: document.getElementById(key),
            to: document.getElementById(child),
          });
          document.body.appendChild(arrow.node);
          allArrows.push(arrow);
        } else if (!keyExists) {
          delete abstractArrow[key];
        } else {
          abstractArrow[key].delete(child);
        }
      });
    });
    console.log(`аровсы posle`, abstractArrow);
  }
}

function removeAbstract(id) {
  let targetIndex = idsArr.indexOf[+id];
  document.getElementById(id).remove();
  abstractArr.splice(targetIndex, 1);
  idsArr.splice(targetIndex, 1);
  arrows();
}
