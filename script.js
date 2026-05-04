// Data store
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// save function
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Enter press
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("taskInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  document.getElementById("search").addEventListener("input", renderTasks);

  renderTasks();
});

// add task
function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (!text) {
    input.classList.add("shake");
    input.placeholder = "Please type something first!";
    setTimeout(() => {
      input.classList.remove("shake");
      input.placeholder = "What needs to be done?";
    }, 800);
    return;
  }

  tasks.unshift({ id: Date.now().toString(36), text, completed: false });

  input.value = "";
  saveTasks();
  filterTasks("all"); // reset to all so user sees new task
}

// Toggle task
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.completed = !task.completed; 
  saveTasks();
  renderTasks();
}

// Edit task
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const taskEl = document.querySelector(`[data-id="${id}"] .task-text`);
  const oldText = task.text;

  taskEl.contentEditable = "true";
  taskEl.focus();

  // select all text
  const range = document.createRange();
  range.selectNodeContents(taskEl);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);

  taskEl.classList.add("editing");

  const finishEdit = () => {
    taskEl.contentEditable = "false";
    taskEl.classList.remove("editing");
    const newText = taskEl.innerText.trim();
    if (newText && newText !== oldText) {
      task.text = newText;
      saveTasks();
    } else {
      taskEl.innerText = oldText;
    }
    taskEl.removeEventListener("blur", finishEdit);
    taskEl.removeEventListener("keydown", onKey);
  };

  const onKey = (e) => {
    if (e.key === "Enter") { e.preventDefault(); finishEdit(); }
    if (e.key === "Escape") { taskEl.innerText = oldText; finishEdit(); }
  };

  taskEl.addEventListener("blur", finishEdit);
  taskEl.addEventListener("keydown", onKey);
}

// Delete task
function deleteTask(id) {
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.classList.add("removing");
    setTimeout(() => {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
      renderTasks();
    }, 250);
  }
}

//  Clear Completed tasks
function clearCompleted() {
  const completed = document.querySelectorAll(".task.done");
  if (!completed.length) return;

  completed.forEach((card, i) => {
    setTimeout(() => card.classList.add("removing"), i * 50);
  });

  setTimeout(() => {
    tasks = tasks.filter(t => !t.completed);
    saveTasks();
    renderTasks();
  }, completed.length * 50 + 260);
}

//  Filter 
function filterTasks(type) {
  currentFilter = type;

  // update active button
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  document.getElementById(`btn-${type}`).classList.add("active");

  renderTasks();
}

//  Render ui
function renderTasks() {
  const list = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const emptyMsg = document.getElementById("emptyMsg");
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = tasks.filter(task => {
    const matchFilter =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    const matchSearch = task.text.toLowerCase().includes(search);

    return matchFilter && matchSearch;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.style.display = "flex";
    const msgs = {
      all: "No tasks yet. Add one above!",
      pending: "No pending tasks — you're all caught up! 🎉",
      completed: "Nothing completed yet. Get to work! 💪"
    };
    emptyMsg.textContent = search ? `No results for "${search}"` : msgs[currentFilter];
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach((task, i) => {
    const div = document.createElement("div");
    div.className = "task" + (task.completed ? " done" : "");
    div.dataset.id = task.id;
    div.style.animationDelay = `${i * 0.04}s`;

    div.innerHTML = `
      <button class="check-btn ${task.completed ? 'checked' : ''}" onclick="toggleTask('${task.id}')" title="${task.completed ? 'Mark as pending' : 'Mark as complete'}">
        ${task.completed ? '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><polyline points="1.5,6 4.5,9 10.5,3" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : ''}
      </button>
      <span class="task-text ${task.completed ? 'completed' : ''}">${escapeHTML(task.text)}</span>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask('${task.id}')" title="Edit">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><line x1="1" y1="1" x2="11" y2="11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><line x1="11" y1="1" x2="1" y2="11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    `;

    list.appendChild(div);
  });

  updateCounts();
}

// Count update 
function updateCounts() {
  document.getElementById("allCount").textContent = tasks.length;
  document.getElementById("pendingCount").textContent = tasks.filter(t => !t.completed).length;
  document.getElementById("completedCount").textContent = tasks.filter(t => t.completed).length;
}

//security
function escapeHTML(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}