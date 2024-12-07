// Store projects and tasks in localStorage
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let draggedTask = null;

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Add theme toggle listener
document.getElementById('themeToggle').addEventListener('click', toggleTheme);

// Project handling
function createProject(name) {
    const project = {
        id: Date.now(),
        name: name,
        tasks: []
    };
    projects.unshift(project);
    saveProjects();
    renderProjects();
    // Focus the task input of the new project
    setTimeout(() => {
        document.getElementById(`taskInput-${project.id}`).focus();
    }, 0);
}

function deleteProject(projectId) {
    projects = projects.filter(project => project.id !== projectId);
    saveProjects();
    renderProjects();
}

// Task handling
function createTask(projectId, text) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.tasks.unshift({
            id: Date.now(),
            text: text,
            completed: false
        });
        saveProjects();
        renderProjects();
        // Focus the input after render
        setTimeout(() => {
            document.getElementById(`taskInput-${projectId}`).focus();
        }, 0);
    }
}

function toggleTask(projectId, taskId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const task = project.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveProjects();
            renderProjects();
        }
    }
}

function deleteTask(projectId, taskId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        project.tasks = project.tasks.filter(task => task.id !== taskId);
        saveProjects();
        renderProjects();
    }
}

// Rendering
function renderProjects() {
    const projectsContainer = document.getElementById('projects');
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project" data-project-id="${project.id}">
            <div class="project-header">
                <div class="project-title">
                    <h2>${project.name}</h2>
                </div>
                <button class="delete-btn" onclick="deleteProject(${project.id})">Delete</button>
            </div>
            <div class="task-list">
                <div class="drop-marker"></div>
                <input type="text" class="task-input" id="taskInput-${project.id}" placeholder="New Task (Press Enter)">
                ${project.tasks.map(task => `
                    <div class="task ${task.completed ? 'completed' : ''}"
                        data-project-id="${project.id}"
                        data-task-id="${task.id}">
                        <div class="drag-handle" draggable="true" onmousedown="startDrag(event)">⋮⋮</div>
                        <input type="checkbox" 
                            ${task.completed ? 'checked' : ''} 
                            onchange="toggleTask(${project.id}, ${task.id})">
                        <span>${task.text}</span>
                        <button class="delete-btn" onclick="deleteTask(${project.id}, ${task.id})">Delete</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Add event listeners
    document.querySelectorAll('.task-list').forEach(list => {
        list.addEventListener('dragover', handleDragOver);
        list.addEventListener('drop', handleDrop);
        list.addEventListener('dragleave', handleDragLeave);
    });

    // Add event listeners for task inputs
    projects.forEach(project => {
        const input = document.getElementById(`taskInput-${project.id}`);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                    createTask(project.id, e.target.value.trim());
                    e.target.value = '';
                }
            });
        }
    });
}

function startDrag(event) {
    const handle = event.target;
    const task = handle.closest('.task');
    
    handle.addEventListener('dragstart', (e) => {
        draggedTask = task;
        task.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    
    handle.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        draggedTask = null;
        // Hide all drop markers
        document.querySelectorAll('.drop-marker').forEach(marker => {
            marker.classList.remove('active');
            marker.style.top = '';
        });
    }, { once: true });
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    
    if (!draggedTask) return;
    
    const taskList = event.currentTarget;
    const marker = taskList.querySelector('.drop-marker');
    const rect = taskList.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;
    
    const tasks = Array.from(taskList.querySelectorAll('.task:not(.dragging)'));
    let targetTask = null;
    let markerTop = 0;
    
    // Hide markers in other task lists
    document.querySelectorAll('.task-list').forEach(list => {
        if (list !== taskList) {
            list.querySelector('.drop-marker').classList.remove('active');
        }
    });
    
    if (tasks.length === 0) {
        // If no tasks, position marker after input
        const input = taskList.querySelector('.task-input');
        markerTop = input.offsetTop + input.offsetHeight + 4;
    } else {
        for (const task of tasks) {
            const taskRect = task.getBoundingClientRect();
            const taskTop = taskRect.top - rect.top;
            const taskMiddle = taskTop + taskRect.height / 2;
            
            if (mouseY < taskMiddle) {
                targetTask = task;
                markerTop = taskTop - 2;
                break;
            }
        }
        
        if (!targetTask) {
            // Position after last task
            const lastTask = tasks[tasks.length - 1];
            markerTop = lastTask.offsetTop + lastTask.offsetHeight + 2;
        }
    }
    
    marker.style.top = `${markerTop}px`;
    marker.classList.add('active');
}

function handleDragLeave(event) {
    const taskList = event.currentTarget;
    const marker = taskList.querySelector('.drop-marker');
    
    // Only hide marker if we're actually leaving the task list
    if (!event.relatedTarget || !taskList.contains(event.relatedTarget)) {
        marker.classList.remove('active');
    }
}

function handleDrop(event) {
    event.preventDefault();
    if (!draggedTask) return;

    const taskList = event.currentTarget;
    const marker = taskList.querySelector('.drop-marker');
    marker.classList.remove('active');
    
    const targetProject = taskList.closest('.project');
    
    // Get source and target project IDs
    const sourceProjectId = parseInt(draggedTask.dataset.projectId);
    const targetProjectId = parseInt(targetProject.dataset.projectId);
    const taskId = parseInt(draggedTask.dataset.taskId);

    // Find insertion point
    const mouseY = event.clientY;
    const tasks = Array.from(taskList.querySelectorAll('.task:not(.dragging)'));
    const insertBefore = tasks.find(task => {
        const rect = task.getBoundingClientRect();
        return mouseY < rect.top + rect.height / 2;
    });

    // Update data model
    const sourceProject = projects.find(p => p.id === sourceProjectId);
    const taskIndex = sourceProject.tasks.findIndex(t => t.id === taskId);
    const [task] = sourceProject.tasks.splice(taskIndex, 1);

    const targetProjectData = projects.find(p => p.id === targetProjectId);
    if (insertBefore) {
        const beforeTaskId = parseInt(insertBefore.dataset.taskId);
        const targetIndex = targetProjectData.tasks.findIndex(t => t.id === beforeTaskId);
        targetProjectData.tasks.splice(targetIndex, 0, task);
    } else {
        targetProjectData.tasks.push(task);
    }

    saveProjects();
    renderProjects();
}

function saveProjects() {
    localStorage.setItem('projects', JSON.stringify(projects));
}

// Project input handling
document.getElementById('projectInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
        createProject(e.target.value.trim());
        e.target.value = '';
    }
});

// Initial render
renderProjects();