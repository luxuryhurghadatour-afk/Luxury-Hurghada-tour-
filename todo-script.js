// Configuration
const STORAGE_KEY = 'todoList';

// DOM Elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const totalCount = document.getElementById('total-count');
const completedCount = document.getElementById('completed-count');
const remainingCount = document.getElementById('remaining-count');
const clearCompletedBtn = document.getElementById('clear-completed-btn');
const clearAllBtn = document.getElementById('clear-all-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// State
let tasks = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    updateStats();
    
    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedBtn.addEventListener('click', clearCompleted);
    clearAllBtn.addEventListener('click', clearAll);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
});

/**
 * Add a new task
 */
function addTask() {
    const text = taskInput.value.trim();
    
    if (!text) {
        alert('الرجاء إدخال مهمة!');
        taskInput.focus();
        return;
    }
    
    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString('ar-EG')
    };
    
    tasks.unshift(task);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskInput.focus();
}

/**
 * Delete a task
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

/**
 * Toggle task completion
 */
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

/**
 * Render tasks based on current filter
 */
function renderTasks() {
    taskList.innerHTML = '';
    
    let filteredTasks = tasks;
    
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(t => t.completed);
    }
    
    if (filteredTasks.length === 0) {
        taskList.classList.add('empty');
        return;
    }
    
    taskList.classList.remove('empty');
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${escapeHtml(task.text)}</span>
            <span class="task-date">${task.createdAt}</span>
            <button class="task-delete-btn" onclick="deleteTask(${task.id})">حذف</button>
        `;
        taskList.appendChild(li);
    });
}

/**
 * Update statistics
 */
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const remaining = total - completed;
    
    totalCount.textContent = total;
    completedCount.textContent = completed;
    remainingCount.textContent = remaining;
}

/**
 * Clear completed tasks
 */
function clearCompleted() {
    const completedTasks = tasks.filter(t => t.completed).length;
    
    if (completedTasks === 0) {
        alert('لا توجد مهام مكتملة!');
        return;
    }
    
    if (confirm(`هل تريد حذف ${completedTasks} مهمة مكتملة؟`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
        updateStats();
    }
}

/**
 * Clear all tasks
 */
function clearAll() {
    if (tasks.length === 0) {
        alert('لا توجد مهام للحذف!');
        return;
    }
    
    if (confirm('هل تريد حذف جميع المهام؟ لا يمكن التراجع عن هذا الإجراء!')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
        currentFilter = 'all';
        filterBtns.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === 0);
        });
    }
}

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        alert('خطأ في حفظ المهام');
    }
}

/**
 * Load tasks from localStorage
 */
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        tasks = [];
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}