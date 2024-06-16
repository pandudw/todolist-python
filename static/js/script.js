document.addEventListener('DOMContentLoaded', (event) => {
    fetchTasks();
});

function fetchTasks() {
    fetch('/tasks')
        .then(response => response.json())
        .then(data => {
            const taskList = document.getElementById('taskList');
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.textContent = task.task;
                li.appendChild(createDeleteButton(task.id));
                li.appendChild(createEditButton(task.id, task.task));
                taskList.appendChild(li);
            });
        });
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();
    if (task) {
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task: task }),
        })
        .then(response => response.json())
        .then(data => {
            taskInput.value = '';
            fetchTasks();
        });
    }
}

function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
    })
    .then(() => fetchTasks());
}

function editTask(taskId, newTask) {
    fetch(`/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: newTask }),
    })
    .then(() => fetchTasks());
}

function createDeleteButton(taskId) {
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => deleteTask(taskId);
    return btn;
}

function createEditButton(taskId, oldTask) {
    const btn = document.createElement('button');
    btn.textContent = 'Edit';
    btn.onclick = () => {
        const newTask = prompt('Edit Task', oldTask);
        if (newTask && newTask !== oldTask) {
            editTask(taskId, newTask);
        }
    };
    return btn;
}
