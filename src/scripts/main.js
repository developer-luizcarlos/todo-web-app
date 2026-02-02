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
