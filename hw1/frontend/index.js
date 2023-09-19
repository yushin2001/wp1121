/* global axios */
const itemTemplate = document.querySelector("#todo-item-template");
const todoList = document.querySelector("#todos");

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
});

async function main() {
  setupEventListeners();
  try {
    const todos = await getTodos();
    todos.forEach((todo) => renderTodo(todo));
  } catch (error) {
    alert("Failed to load todos!");
  }
}

function setupEventListeners() {
  const addDiaryButton = document.querySelector("#diary-add");
  const diaryInput = document.querySelector("#diary-input");
  const diaryDescriptionInput = document.querySelector("#diary-description-input");

  /* 新增日記本按鈕 */
  const NewDiary = document.querySelector("#new-diary");
  NewDiary.addEventListener("click", function () {
        myPopup.classList.add("show");
        try {
          const timestamp = createtime();
        } catch (error) {
          alert("Failed to load time!");
        }
    });
    closePopup.addEventListener("click", function () {
        myPopup.classList.remove("show");
    });
    window.addEventListener("click", function (event) {
        if (event.target == myPopup) {
            myPopup.classList.remove("show");
        }
    });

  addDiaryButton.addEventListener("click", async () => {
    const title = diaryInput.value;
    const description = diaryDescriptionInput.value;
    if (!title) {
      alert("Please enter a todo title!");
      return;
    }
    if (!description) {
      alert("Please enter a todo description!");
      return;
    }
    try {
      const todo = await createTodo({ title, description });
      renderTodo(todo);
    } catch (error) {
      alert("Failed to create todo!");
      return;
    }
    diaryInput.value = "";
    diaryDescriptionInput.value = "";
  });
}

function renderTodo(todo) {
  const item = createTodoElement(todo);
  todoList.appendChild(item);
}

function createTodoElement(todo) {
  const item = itemTemplate.content.cloneNode(true);
  const container = item.querySelector(".todo-item");
  container.id = todo.id;
  console.log(todo);
  const checkbox = item.querySelector(`input[type="checkbox"]`);
  checkbox.checked = todo.completed;
  checkbox.dataset.id = todo.id;
  const title = item.querySelector("p.todo-title");
  title.innerText = todo.title;
  const description = item.querySelector("p.todo-description");
  description.innerText = todo.description;
  const deleteButton = item.querySelector("button.delete-todo");
  deleteButton.dataset.id = todo.id;
  deleteButton.addEventListener("click", () => {
    deleteTodoElement(todo.id);
  });
  return item;
}

async function deleteTodoElement(id) {
  try {
    await deleteTodoById(id);
  } catch (error) {
    alert("Failed to delete todo!");
  } finally {
    const todo = document.getElementById(id);
    todo.remove();
  }
}

async function getTodos() {
  const response = await instance.get("/todos");
  return response.data;
}

async function createTodo(todo) {
  const response = await instance.post("/todos", todo);
  return response.data;
}

// eslint-disable-next-line no-unused-vars
async function updateTodoStatus(id, todo) {
  const response = await instance.put(`/todos/${id}`, todo);
  return response.data;
}

async function deleteTodoById(id) {
  const response = await instance.delete(`/todos/${id}`);
  return response.data;
}

// for timestamp
async function createtime(){
  const dayNamesZh = [ '日', '一', '二', '三', '四', '五', '六']
  const dateObject = new Date()
  const date = dateObject.getDate()
  if (date < 10){
    date = '0'+ date
  }
  const day = dayNamesZh[dateObject.getDay()]
  const month = dateObject.getMonth() + 1
  if (month < 10){
    month = '0'+ month
  }
  const year = dateObject.getFullYear()
  const formattedDate = year + '.' + month + '.' + date + '(' + day + ')'
  return formattedDate;
}


main();