const addDetailsBTn = document.getElementById("addDetailsBtn");
const taskDetailsInput = document.getElementById("taskDetailsInput");
const taskTable = document.getElementById("taskTable");



const alunmos_completed = [];
const alumnosAllActive = [];

// getLocal ();
// Variable booleana para indicar si estamos en la sección "Completed" o no
let isCompletedSection = false;

// Función para filtrar las tareas según el tipo (all, active, completed)
function completeTask(type) {
    const listItems = document.querySelectorAll(".list-group-item");
    for (const item of listItems) {
        item.classList.remove("active");
    }

    const taskTableTBody = taskTable.querySelector("tbody");
    const completedTasksTableTBody = document.getElementById("completedTasksTable").querySelector("tbody");
    const deleteCompletedBtn = document.getElementById("deleteCompletedBtn");
    const addDetailsBtnSection = document.querySelector(".input-group");

    if (type === "all") {
        taskTableTBody.style.display = "table-row-group";
        completedTasksTableTBody.style.display = "table-row-group";
        listItems[0].classList.add("active");
        deleteCompletedBtn.style.display = "none";
        addDetailsBtnSection.style.display = "flex";
        isCompletedSection = false; // No estamos en la sección "Completed"
    } else if (type === "active") {
        taskTableTBody.style.display = "table-row-group";
        completedTasksTableTBody.style.display = "none";
        listItems[1].classList.add("active");
        deleteCompletedBtn.style.display = "none";
        addDetailsBtnSection.style.display = "flex";
        isCompletedSection = false; // No estamos en la sección "Completed"
    } else if (type === "completed") {
        taskTableTBody.style.display = "none";
        completedTasksTableTBody.style.display = "table-row-group";
        listItems[2].classList.add("active");
        deleteCompletedBtn.style.display = "block";
        addDetailsBtnSection.style.display = "none"; // Ocultar el campo de entrada de texto y el botón "Add"
        isCompletedSection = true; // Estamos en la sección "Completed"
    }

    // Remove 'active-section' class from all list items
    listItems.forEach(item => item.classList.remove("active-section"));

    // Add 'active-section' class to the selected list item
    listItems.forEach(item => {
        if (item.textContent.toLowerCase() === type) {
            item.classList.add("active-section");
        }
    });

    updateDeleteCompletedBtnVisibility();
}

// Función para agregar una nueva tarea a la tabla
function addTask() {
    const taskDetails = taskDetailsInput.value.trim();
    if (taskDetails === "") {
    return;
}

const newRow = document.createElement("tr");
newRow.innerHTML = `
    <td>
        <input type="checkbox" class="checkbox-custom" onclick="markAsCompleted(this)">
        <span>${taskDetails}</span>
    </td>
    <td>
        ${isCompletedSection ? `
        <button class="delete-task-btn" onclick="deleteTask(this)">
            <img src="trash.svg" id="none" alt="Delete">
        </button>` : ''}
    </td>
    `;
    
    taskTable.querySelector("tbody").appendChild(newRow);

    if (isCompletedSection) {
    alunmos_completed.push(taskDetails);
    updateCompletedTasksTable();
    updateDeleteCompletedBtnVisibility();
} else {
    alumnosAllActive.push(newRow.cloneNode(true));
}

taskDetailsInput.value = "";
taskDetailsInput.focus ()
}

function markAsCompleted(checkbox) {
    const taskRow = checkbox.parentNode.parentNode;
    const taskDetails = taskRow.querySelector("span").textContent;
    const index = alumnosAllActive.findIndex((row) => row.querySelector("span").textContent === taskDetails);

    if (checkbox.checked) {
        alunmos_completed.push(taskDetails);
        if (index !== -1) {
        alumnosAllActive.splice(index, 1);
    }
} else {
    alumnosAllActive.push(taskRow.cloneNode(true));
        if (index !== -1) {
            alunmos_completed.splice(index, 1);
        }
    }

    updateCompletedTasksTable();
    updateActiveTasksTable(); // Agregamos esta llamada para actualizar la tabla de tareas activas
    updateDeleteCompletedBtnVisibility();
}

  // Función para actualizar la tabla de tareas activas
function updateActiveTasksTable() {
    const taskTableTBody = taskTable.querySelector("tbody");
    taskTableTBody.innerHTML = "";

    for (const taskRow of alumnosAllActive) {
        taskTableTBody.appendChild(taskRow.cloneNode(true));
    }
}

// Función para eliminar una tarea
function deleteTask(deleteBtn) {
    const taskRow = deleteBtn.parentNode.parentNode;
    const taskDetails = taskRow.querySelector("span").textContent;
    const index = alunmos_completed.indexOf(taskDetails);
if (index !== -1) {
        alunmos_completed.splice(index, 1);
        updateCompletedTasksTable();
        updateDeleteCompletedBtnVisibility();
} else {
    taskRow.remove();
}
}

// Función para actualizar la tabla de tareas completadas
function updateCompletedTasksTable() {
    const completedTasksTable = document.getElementById("completedTasksTable");
    const completedTasksTBody = completedTasksTable.querySelector("tbody");
    completedTasksTBody.innerHTML = "";

for (const task of alunmos_completed) {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
    <td>
        <input type="checkbox" class="checkbox-custom" checked disabled>
            <span>${task}</span>
    </td>
    <td>
        <button class="delete-task-btn" onclick="deleteTask(this)">
            <img src="trash.svg" alt="Delete">
        </button>
    </td>
    `;
    completedTasksTBody.appendChild(newRow);
}
}

// Función para actualizar la visibilidad del botón "Delete All" para tareas completadas
function updateDeleteCompletedBtnVisibility() {
    const deleteCompletedBtn = document.getElementById("deleteCompletedBtn");
    deleteCompletedBtn.style.display = alunmos_completed.length > 0 && isCompletedSection ? "block" : "none";
}

// Función para borrar todas las tareas completadas
function deleteAllCompleted() {
    alunmos_completed.splice(0, alunmos_completed.length);
    updateCompletedTasksTable();
    updateDeleteCompletedBtnVisibility();
}

// Inicializar eventos y variables
taskDetailsInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        addTask();
}
});

// Guardar todas las tareas activas iniciales para el filtrado
document.querySelectorAll("#taskTable tbody tr").forEach((task) => alumnosAllActive.push(task.cloneNode(true)));

// Mostrar todas las tareas al cargar la página
completeTask("all");

