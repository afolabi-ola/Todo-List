"use strict";

const todoFormContainer = document.querySelector(".todo-form-cont");
const addTodoForm = document.querySelector(".todo_form");
const textInput = document.querySelector(".todo_input");
const addBtn = document.querySelector(".add_Btn");
const ul = document.querySelector(".ulist");
const sortBtn = document.querySelector(".sort");

let localDb = [];

function getTodos() {
  const dataBaseTodos = localStorage.getItem("db");

  if (dataBaseTodos) {
    localDb = [...JSON.parse(dataBaseTodos)];
    ul.innerHTML = localDb.map(renderTodos).join("");
  }
   checkSort();
}

function renderTodos(todo) {
  const checked = todo.completed ? "checked" : "null";

  return `
  <li class="list" id=${todo.id}>
  <input class="checkbox" type="checkbox" ${checked}>
  <p class="li_text ${todo.completed ? "checked" : ""}">${todo.name}</p>
  <i class="fas fa-trash-alt trash"></i>
  </li>
  `;
}

function addTodosToLocalStorage(todos) {
  localStorage.setItem("db", JSON.stringify(todos));
  ul.innerHTML = todos.map(renderTodos).join("");
  checkSort();
}

function addList(item) {
  if (item !== "") {
    const todo = {
      id: crypto.randomUUID(),
      name: item,
      completed: false,
    };
    localDb = [...localDb, todo];
    addTodosToLocalStorage(localDb);
    textInput.value = "";
    addBtn.classList.remove("active");
  }
}

addTodoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addList(textInput.value);
});

const handleNewRender = function () {
  textInput.focus();
  getTodos();
  checkSort();
  textInput.addEventListener("input", () => {
    addBtn.classList.add("active");
  });
};

function toggleCompleted(id) {
  localDb = localDb.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : { ...todo }
  );
  addTodosToLocalStorage(localDb);
}

function handleDeleteTodo(id) {
  localDb = localDb.filter((todo) => todo.id !== id);
  addTodosToLocalStorage(localDb);
}

function removeForm(formType) {
  todoFormContainer.removeChild(formType);
}

function appendForm(formType) {
  todoFormContainer.appendChild(formType);
}

function createForm(todo) {
  removeForm(addTodoForm);
  const editForm = document.createElement("form");
  const editInput = document.createElement("input");
  const editBtn = document.createElement("input");
  editBtn.type = "submit";
  editBtn.value = "Edit";
  editForm.classList.add("todo-form2");
  editInput.classList.add("todo_input2");
  editBtn.classList.add("edit-add_Btn");
  editForm.appendChild(editInput);
  editForm.appendChild(editBtn);
  appendForm(editForm);
  editInput.value = todo.name;
  return [editForm, editInput, editBtn];
}

function handleEditTodos(id) {
  localDb.forEach((todo) => {
    if (id === todo.id) {
      const [editForm, editInput, editBtn] = createForm(todo);
      editInput.focus();

      editInput.addEventListener("input", () => {
        editBtn.classList.add("active");
      });

      editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        todo.name = editInput.value;
        editInput.value = "";
        editBtn.classList.remove("active");
        removeForm(editForm);
        appendForm(addTodoForm);
        addTodosToLocalStorage(localDb);
      });
    }
  });
}

ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("trash")) {
    handleDeleteTodo(e.target.parentElement.getAttribute("id"));
  }
  if (e.target.classList.contains("checkbox")) {
    toggleCompleted(e.target.parentElement.getAttribute("id"));
  }
  if (e.target.classList.contains("li_text")) {
    handleEditTodos(e.target.parentElement.getAttribute("id"));
  }
});


function checkSort() {
  localDb = JSON.parse(localStorage.getItem("db"));
 if(localDb){ if (localDb.length > 1) {
    sortBtn.classList.add("active");
  } else {
    sortBtn.classList.remove("active");
  }
            }
}

sortBtn.addEventListener("click", () => {
  localDb = JSON.parse(localStorage.getItem("db"));
  localDb = localDb.sort((a, b) => a.completed - b.completed);
  addTodosToLocalStorage(localDb);
});

window.addEventListener("DOMContentLoaded", handleNewRender);
