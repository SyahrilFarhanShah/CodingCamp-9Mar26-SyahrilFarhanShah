/**
 * TodoList Component
 * Manages a collection of todo items with CRUD operations
 * 
 * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8**
 */

function createTodoList(storage) {
  let todos = [];
  let containerElement = null;
  let sortBy = 'created'; // 'created', 'alphabetical', 'completed'

  /**
   * Generate unique ID for todo items
   * @returns {string} Unique identifier
   */
  function generateId() {
    return `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate todo description
   * @param {string} description - Todo description to validate
   * @returns {boolean} True if valid
   */
  function isValidDescription(description) {
    if (typeof description !== 'string') {
      return false;
    }
    return description.trim().length > 0 && description.length <= 500;
  }

  /**
   * Initialize component and restore todos from storage
   * @param {HTMLElement} container - DOM container element
   */
  function init(container) {
    containerElement = container;
    restoreTodos();
    // Load sort preference
    const saved = storage.get('todo-sort-preference');
    if (saved && ['created', 'alphabetical', 'completed'].includes(saved)) {
      sortBy = saved;
    }
    render();
  }

  /**
   * Add new todo item
   * @param {string} description - Task description
   * @returns {boolean} True if successfully added
   */
  function addTodo(description) {
    if (!isValidDescription(description)) {
      return false;
    }

    const todo = {
      id: generateId(),
      description: description.trim(),
      completed: false,
      createdAt: Date.now()
    };

    todos.push(todo);
    saveTodos();
    render();
    return true;
  }

  /**
   * Edit existing todo
   * @param {string} id - Todo ID
   * @param {string} newDescription - New task description
   * @returns {boolean} True if successfully edited
   */
  function editTodo(id, newDescription) {
    if (!isValidDescription(newDescription)) {
      return false;
    }

    const todo = todos.find(t => t.id === id);
    if (!todo) {
      return false;
    }

    todo.description = newDescription.trim();
    saveTodos();
    render();
    return true;
  }

  /**
   * Toggle todo completion status
   * @param {string} id - Todo ID
   */
  function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      saveTodos();
      render();
    }
  }

  /**
   * Delete todo
   * @param {string} id - Todo ID
   */
  function deleteTodo(id) {
    const initialLength = todos.length;
    todos = todos.filter(t => t.id !== id);
    
    if (todos.length !== initialLength) {
      saveTodos();
      render();
    }
  }

  /**
   * Get sorted todos based on current sort preference
   * @returns {Array} Sorted array of todos
   */
  function getSortedTodos() {
    const sorted = [...todos];
    
    switch(sortBy) {
      case 'alphabetical':
        return sorted.sort((a, b) => 
          a.description.toLowerCase().localeCompare(b.description.toLowerCase())
        );
      case 'completed':
        return sorted.sort((a, b) => {
          // Incomplete tasks first, then completed
          if (a.completed === b.completed) {
            return a.createdAt - b.createdAt;
          }
          return a.completed ? 1 : -1;
        });
      case 'created':
      default:
        return sorted.sort((a, b) => a.createdAt - b.createdAt);
    }
  }

  /**
   * Set sort preference
   * @param {string} newSort - Sort type: 'created', 'alphabetical', 'completed'
   */
  function setSortBy(newSort) {
    if (['created', 'alphabetical', 'completed'].includes(newSort)) {
      sortBy = newSort;
      storage.set('todo-sort-preference', sortBy);
      render();
    }
  }

  /**
   * Get current sort preference
   * @returns {string} Current sort type
   */
  function getSortBy() {
    return sortBy;
  }

  /**
   * Render all todos to DOM
   */
  function render() {
    if (!containerElement) {
      return;
    }

    containerElement.innerHTML = `
      <div class="todolist">
        <h2>To-Do List</h2>
        <div class="todo-input-container">
          <input type="text" id="todo-input" placeholder="Add a new task..." />
          <button id="todo-add-btn">Add</button>
        </div>
        <div class="todo-sort-container">
          <label for="todo-sort">Sort by:</label>
          <select id="todo-sort">
            <option value="created">Date Created</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="completed">Status (Incomplete First)</option>
          </select>
        </div>
        <ul class="todo-list" id="todo-list"></ul>
      </div>
    `;

    const list = containerElement.querySelector('#todo-list');
    const input = containerElement.querySelector('#todo-input');
    const addBtn = containerElement.querySelector('#todo-add-btn');
    const sortSelect = containerElement.querySelector('#todo-sort');

    // Set current sort option
    sortSelect.value = sortBy;
    sortSelect.addEventListener('change', (e) => setSortBy(e.target.value));

    // Get sorted todos
    const sortedTodos = getSortedTodos();

    // Render todos
    sortedTodos.forEach(todo => {
      const item = document.createElement('li');
      item.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      item.dataset.id = todo.id;

      item.innerHTML = `
        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''} />
        <span class="todo-description">${escapeHtml(todo.description)}</span>
        <button class="todo-edit-btn">Edit</button>
        <button class="todo-delete-btn">Delete</button>
      `;

      // Event listeners
      const checkbox = item.querySelector('.todo-checkbox');
      const editBtn = item.querySelector('.todo-edit-btn');
      const deleteBtn = item.querySelector('.todo-delete-btn');

      checkbox.addEventListener('change', () => toggleTodo(todo.id));
      editBtn.addEventListener('click', () => {
        const newDesc = prompt('Edit task:', todo.description);
        if (newDesc !== null && !editTodo(todo.id, newDesc)) {
          alert('Task description cannot be empty');
        }
      });
      deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

      list.appendChild(item);
    });

    // Add todo event listeners
    const handleAdd = () => {
      const description = input.value;
      if (addTodo(description)) {
        input.value = '';
      } else {
        alert('Task description cannot be empty');
      }
    };

    addBtn.addEventListener('click', handleAdd);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleAdd();
      }
    });
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Save todos to storage
   */
  function saveTodos() {
    storage.set('todos', todos);
  }

  /**
   * Restore todos from storage
   */
  function restoreTodos() {
    const stored = storage.get('todos');
    if (stored && Array.isArray(stored)) {
      todos = stored;
    } else {
      todos = [];
    }
  }

  /**
   * Get all todos (for testing)
   * @returns {Array} Array of todo objects
   */
  function getTodos() {
    return [...todos];
  }

  return {
    init,
    addTodo,
    editTodo,
    toggleTodo,
    deleteTodo,
    render,
    saveTodos,
    restoreTodos,
    isValidDescription,
    getTodos,
    setSortBy,
    getSortBy,
    getSortedTodos
  };
}


