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
const tabAllBtn = document.querySelector(".tablist__tab--all");
const tabActiveBtn = document.querySelector(".tablist__tab--active");
const tabCompletedBtn = document.querySelector(".tablist__tab--completed");
const clearCompletedBtn = document.querySelector(".clear-completed-btn");

// Listeners
createTodoBtn.addEventListener("click", () => {
  console.log(isInputValueValid());
});

// Functions
function isInputValueValid() {
  const value = input.value;
  return value.trim() !== "";
}
