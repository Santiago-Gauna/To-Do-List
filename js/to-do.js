const todoList = document.getElementById("todo-list");
const todoInput = document.getElementById("todo-input");
const todoButton = document.getElementById("todo-button");

let currentfilter = 'all';

// Función para guardar la tarea
function saveTask(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    let task = {};

    formData.forEach((value, key) => task[key] = value);
    task.completed = false;

    const agenda = consultMemory();
    const nuevaAgenda = [...agenda, task];
    setMemory(nuevaAgenda);

    form.reset();
    displayTask(); // Mostrar tareas con el filtro actual
}

// Función para mostrar las tareas en el HTML
function displayTask() {
    const taskElement = document.getElementById('todo-list');
    const agenda = consultMemory();

    if (!taskElement) {
        console.error('No se encontró el elemento');
        return;
    }

    let filteredTasks = [];
    if (currentfilter === 'completed') {
        filteredTasks = agenda.filter(task => task.completed);
    } else if (currentfilter === 'pending') {
        filteredTasks = agenda.filter(task => !task.completed);
    } else {
        filteredTasks = agenda;
    }

    // Crear el HTML para las tareas
    const listTaskHtml = filteredTasks.map((task, index) => {
        return `
        <li class="todo-list_item">
           <div class="todo-list_checkbox-label">
           <input type='checkbox' ${task.completed ? 'checked' : ''} onclick="toggleComplete(${agenda.indexOf(task)})">
           <p style="text-decoration: ${task.completed ? 'line-through' : 'none'}">${task.task}</p>
           </div>
           <button class="todo-list_delete-button" type="button" onclick="deleteTask(${agenda.indexOf(task)})">❌</button>
        </li>
        `;
    });

    taskElement.innerHTML = listTaskHtml.join("");
}

// Función para consultar la memoria local
function consultMemory() {
    const taskInMemory = localStorage.getItem("Agenda");

    if (!taskInMemory) {
        setMemory([]);
        return [];
    }

    return JSON.parse(taskInMemory);
}

// Función para guardar en la memoria local
function setMemory(tasks) {
    localStorage.setItem('Agenda', JSON.stringify(tasks));
}

// Función para eliminar una tarea
function deleteTask(index) {
    const agenda = consultMemory();
    agenda.splice(index, 1);
    setMemory(agenda);
    displayTask(); // Mostrar tareas con el filtro actual
}

// Función para marcar/desmarcar una tarea como completada
function toggleComplete(index) {
    const agenda = consultMemory();
    agenda[index].completed = !agenda[index].completed;
    setMemory(agenda);
    displayTask(); // Mostrar tareas con el filtro actual
}

document.addEventListener("DOMContentLoaded", () => {
    displayTask(); // Mostrar tareas con el filtro actual al cargar la página
});

function taskCompleted() {
    currentfilter = 'completed';
    displayTask(); // Mostrar tareas completadas
}

function pendingTask() {
    currentfilter = 'pending';
    displayTask(); // Mostrar tareas pendientes
}

function showTask() {
    currentfilter = 'all';
    displayTask(); // Mostrar todas las tareas
}

// Añadimos el evento al formulario para guardar la tarea
document.getElementById('todo-form').addEventListener('submit', saveTask);