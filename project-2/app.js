const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const showCompleted = document.getElementById("showCompleted");
const sortByPriority = document.getElementById("sortByPriority");

let tasks = [];

const getPriorityColor = (priority) => {
  const colors = {
    Düşük: "#198754",
    Orta: "#FFC107",
    Yüksek: "#E53935",
  };
  return colors[priority];
};

const createTaskElement = (task) => {
  const taskElement = document.createElement("div");
  taskElement.className = `task-item ${task.completed ? "completed" : ""}`;
  taskElement.dataset.id = task.id;

  const priorityStyle = `color: ${getPriorityColor(
    task.priority
  )}; border: 1px solid ${getPriorityColor(
    task.priority
  )}; padding: 2px 5px; border-radius: 5px; margin-right: 5px; font-size: 0.8rem;`;

  taskElement.innerHTML = `
  <div class="task-content">
    <h3 class="task-title">${task.title}</h3>
    ${
      task.description
        ? `<p class="task-description">${task.description}</p>`
        : ""
    }
    <span style="${priorityStyle}">
      ${task.priority}
    </span>
    <div class="task-actions">
      <button class="btn-complete" onclick="toggleTaskCompleted('${
        task.id
      }')" title="${task.completed ? "Tamamlanmadı" : "Tamamlandı"}">
        <i class="fas ${task.completed ? "fa-check-circle" : "fa-circle"}"></i>
      </button>
      <button class="btn-delete" onclick="deleteTask('${task.id}')" title="Sil">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  </div>
  `;

  return taskElement;
};

const renderTasks = (taskArray = tasks) => {
  taskList.innerHTML = "";
  taskArray.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });
};

const addTask = (e) => {
  e.preventDefault();
  try {
    const title = document.getElementById("taskTitle").value.trim();
    const description = document.getElementById("taskDescription").value.trim();
    const priority = document.querySelector(
      'input[name="priority"]:checked'
    )?.value;

    if (!title) {
      throw new Error("Lütfen bir başlık girin.");
    }
    if (!priority) {
      throw new Error("Lütfen bir öncelik seçin.");
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      completed: false,
    };

    tasks.unshift(newTask);
    renderTasks();
    taskForm.reset();
  } catch (error) {
    alert(error.message);
  }
};

const toggleTaskCompleted = (id) => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex > -1) {
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    renderTasks();
  }
};

const deleteTask = (id) => {
  if (!confirm("Bu görevi silmek istediğinize emin misiniz?")) return;
  tasks = tasks.filter((task) => task.id !== id);
  renderTasks();
};

let showingCompleted = false;
const toggleCompletedTasks = () => {
  showingCompleted = !showingCompleted;
  const filteredTasks = showingCompleted
    ? tasks.filter((task) => task.completed)
    : tasks;
  showCompleted.innerHTML = `
        <i class="fas fa-check-double"></i>
        ${showingCompleted ? "Tüm Görevleri Göster" : "Tamamlananları Göster"}
    `;
  renderTasks(filteredTasks);
};

let sortingByPriority = true;
const sortTasksByPriority = () => {
  const priorityValues = { Düşük: 1, Orta: 2, Yüksek: 3 };

  const sortedTasks = [...tasks].sort((a, b) => {
    const diff = priorityValues[b.priority] - priorityValues[a.priority];
    return sortingByPriority ? -diff : diff;
  });

  sortingByPriority = !sortingByPriority;
  sortByPriority.innerHTML = `
        <i class="fas fa-sort"></i>
        Öncelik: ${sortingByPriority ? "Yüksek → Düşük" : "Düşük → Yüksek"}
    `;

  renderTasks(sortedTasks);
};

taskForm.addEventListener("submit", addTask);
showCompleted.addEventListener("click", toggleCompletedTasks);
sortByPriority.addEventListener("click", sortTasksByPriority);
