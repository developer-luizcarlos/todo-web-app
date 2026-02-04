// DOM Elements
const toggleThemeBtn = document.querySelector(".toggle-theme-btn");
const input = document.querySelector(".input");
const createTodoBtn = document.querySelector(".btn--create-todo");
const todoListAllEl = document.querySelector(".todo__list--all");
const todoListActiveEl = document.querySelector(".todo__list--active");
const todoListCompletedEl = document.querySelector(".todo__list--completed");
const noTodosAvailableLi = document.querySelector(
  ".todo__item--no-todos-available",
);
const itemsLeftEl = document.querySelector(".items-left");
const tabs = document.querySelectorAll(".tablist__tab");
const tabAllBtn = document.querySelector(".tablist__tab--all");
const tabActiveBtn = document.querySelector(".tablist__tab--active");
const tabCompletedBtn = document.querySelector(".tablist__tab--completed");
const clearCompletedBtn = document.querySelector(".clear-completed-btn");

// Listeners
window.addEventListener("DOMContentLoaded", () => {
  renderTodos();
});

clearCompletedBtn.addEventListener("click", () => {
  clearCompletedTodos();
  renderTodos();
});

createTodoBtn.addEventListener("click", () => {
  if (!isInputValueValid()) {
    return;
  }

  const todoTitle = input.value.trim();

  createTodo(todoTitle);

  renderTodos();

  input.value = "";
  input.focus();
});

input.addEventListener("keydown", (event) => {
  const key = event.key;

  if (key !== "Enter") {
    return;
  }

  createTodoBtn.click();
});

tabs.forEach((element, _, arr) => {
  element.addEventListener("click", () => {
    arr.forEach((item) => {
      item.setAttribute("aria-selected", "false");
      item.classList.remove("tablist__tab--selected");
    });

    element.setAttribute("aria-selected", "true");
    element.classList.add("tablist__tab--selected");

    const tabPanels = document.querySelectorAll("*[role='tabpanel']");

    const controledPanel = document.getElementById(
      element.getAttribute("aria-controls"),
    );

    tabPanels.forEach((element) => {
      element.hidden = true;
    });

    controledPanel.hidden = false;
  });
});

// Functions
function clearCompletedTodos() {
  const todos = getTodos();

  if (!todos.length) {
    return;
  }

  const activeTodos = todos.filter((item) => !item.isCompleted);

  localStorage.setItem("todos", JSON.stringify(activeTodos));
}

/**
 *
 * @param {string} title
 */
function createTodo(title) {
  if (typeof title !== "string") {
    throw new TypeError("Expect a string for title property");
  }

  if (!title.trim()) {
    throw new Error("Expect a non-empty string for title property");
  }

  const todos = getTodos();

  const checkIfTodoAlreadyExists = todos.some((t) => {
    return t.title.toLowerCase() === title.trim().toLowerCase();
  });

  if (checkIfTodoAlreadyExists) {
    throw new Error("Todo with the same title already exists");
  }

  todos.push({
    title: title.trim(),
    isCompleted: false,
  });

  localStorage.setItem("todos", JSON.stringify(todos));
}

function createTodoItemElement(title, isCompleted) {
  if (typeof title !== "string") {
    throw new TypeError("Expect a string for title property");
  }

  if (typeof isCompleted !== "boolean") {
    throw new TypeError("Expect a boolean for isCompleted property");
  }

  if (!title.trim()) {
    throw new Error("Expect a non-empty string for title property");
  }

  const todoItemEl = document.createElement("li");
  const customCheckbox = document.createElement("div");
  const label = document.createElement("label");

  todoItemEl.className = "todo__item";

  customCheckbox.classList.add("custom-checkbox");
  customCheckbox.tabIndex = 1;
  customCheckbox.role = "checkbox";
  customCheckbox.ariaChecked = isCompleted;
  customCheckbox.ariaLabel = "Toggle the completeness of this todo";

  label.textContent = title.trim();

  todoItemEl.insertAdjacentElement("beforeend", customCheckbox);
  todoItemEl.insertAdjacentElement("beforeend", label);

  if (isCompleted) {
    todoItemEl.classList.add("todo__item--completed");

    customCheckbox.classList.add("custom-checkbox--checked");
    customCheckbox.innerHTML = "&check;";
  }

  todoItemEl.addEventListener("click", (event) => {
    const target = event.target;

    if (target === customCheckbox || target === label) {
      const todoText = label.textContent.trim();
      const todoIndex = findTodoIndex(todoText);

      if (todoIndex === -1) {
        return;
      }

      toggleTodoCompleteness(todoIndex);

      renderTodos();
    }
  });

  customCheckbox.addEventListener("keydown", (event) => {
    const key = event.key;

    const isTriggerKey = key === " " || key === "Enter";

    if (!isTriggerKey) {
      return;
    }

    customCheckbox.click();
  });

  return todoItemEl;
}

function findTodoIndex(todoTitle) {
  if (typeof todoTitle !== "string") {
    throw new TypeError("Expect a string");
  }

  if (!todoTitle.trim()) {
    throw new Error("Expect a non-empty string");
  }

  const todos = getTodos();

  if (!todos.length) {
    return -1;
  }

  return todos.findIndex((item) => {
    return item.title === todoTitle;
  });
}

/**
 * Get an array of objects representing each one of them
 * a todo, having a title and isCompleted fields, if some
 * todo exists, or an empty array if no todo was previously
 * saved.
 * @returns {{title: string; isCompleted: boolean}[] | []}
 */
function getTodos() {
  try {
    const todos = JSON.parse(localStorage.getItem("todos"));

    const isValidTodosArray = () => {
      const conditions = [
        Array.isArray(todos),
        todos.every((t) => {
          return (
            typeof t.title === "string" &&
            typeof t.isCompleted === "boolean" &&
            typeof t === "object"
          );
        }),
      ];

      return conditions.every((c) => c);
    };

    if (isValidTodosArray()) {
      return todos;
    } else {
      return [];
    }
  } catch {
    return [];
  }
}

function isInputValueValid() {
  const value = input.value;
  return value.trim() !== "";
}

function renderTodos() {
  const todos = getTodos();

  if (!todos.length) {
    todoListAllEl.innerHTML =
      "<li class='todo__item todo__item--no-todos-available'>No todos available</li>";
    todoListActiveEl.innerHTML =
      "<li class='todo__item todo__item--no-todos-available'>No todos available</li>";
    todoListCompletedEl.innerHTML =
      "<li class='todo__item todo__item--no-todos-available'>No todos available</li>";

    return;
  }

  const activeTodos = todos.filter((item) => !item.isCompleted);
  const completedTodos = todos.filter((item) => item.isCompleted);

  todoListAllEl.innerText = "";
  todoListActiveEl.innerText = "";
  todoListCompletedEl.innerText = "";

  const fillTabPanelWithTodos = (tabPanel, todosArr) => {
    if (!todosArr.length) {
      tabPanel.innerHTML =
        "<li class='todo__item todo__item--no-todos-available'>No todos available</li>";

      return;
    }

    todosArr.forEach((item) => {
      const { title, isCompleted } = item;

      const todoItem = createTodoItemElement(title, isCompleted);

      tabPanel.insertAdjacentElement("beforeend", todoItem);
    });
  };

  fillTabPanelWithTodos(todoListAllEl, todos);
  fillTabPanelWithTodos(todoListActiveEl, activeTodos);
  fillTabPanelWithTodos(todoListCompletedEl, completedTodos);
}

function toggleTodoCompleteness(todoIndex) {
  if (typeof todoIndex !== "number") {
    throw new TypeError("Expect a number");
  }

  const todos = getTodos();

  if (todoIndex < 0 || todoIndex >= todos.length) {
    throw new RangeError("Expect a valid index value");
  }

  todos[todoIndex].isCompleted = !todos[todoIndex].isCompleted;

  localStorage.setItem("todos", JSON.stringify(todos));
}
