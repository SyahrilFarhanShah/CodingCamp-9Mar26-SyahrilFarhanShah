/**
 * TodoList Component Tests
 * Tests for todo CRUD operations and persistence
 */

import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { createTodoList } from './todolist.js';

function createMockStorage() {
  const data = new Map();
  return {
    get(key) {
      return data.has(key) ? data.get(key) : null;
    },
    set(key, value) {
      data.set(key, value);
      return true;
    },
    remove(key) {
      data.delete(key);
    },
    isAvailable() {
      return true;
    },
    getError() {
      return null;
    },
    clear() {
      data.clear();
    }
  };
}

describe('TodoList Component', () => {
  let storage;
  let todoList;
  let container;

  beforeEach(() => {
    storage = createMockStorage();
    todoList = createTodoList(storage);
    container = document.createElement('div');
  });

  afterEach(() => {
    storage.clear();
  });

  test('should add valid todo', () => {
    const result = todoList.addTodo('Buy groceries');
    expect(result).toBe(true);
    expect(todoList.getTodos().length).toBe(1);
  });

  test('should reject empty todo', () => {
    const result = todoList.addTodo('');
    expect(result).toBe(false);
    expect(todoList.getTodos().length).toBe(0);
  });

  test('should reject whitespace-only todo', () => {
    const result = todoList.addTodo('   ');
    expect(result).toBe(false);
    expect(todoList.getTodos().length).toBe(0);
  });

  test('should edit todo', () => {
    todoList.addTodo('Original task');
    const todos = todoList.getTodos();
    const result = todoList.editTodo(todos[0].id, 'Updated task');
    expect(result).toBe(true);
    expect(todoList.getTodos()[0].description).toBe('Updated task');
  });

  test('should toggle todo completion', () => {
    todoList.addTodo('Task');
    const todos = todoList.getTodos();
    expect(todos[0].completed).toBe(false);
    
    todoList.toggleTodo(todos[0].id);
    expect(todoList.getTodos()[0].completed).toBe(true);
  });

  test('should delete todo', () => {
    todoList.addTodo('Task 1');
    todoList.addTodo('Task 2');
    const todos = todoList.getTodos();
    
    todoList.deleteTodo(todos[0].id);
    expect(todoList.getTodos().length).toBe(1);
  });

  test('should persist todos to storage', () => {
    todoList.addTodo('Task');
    const stored = storage.get('todos');
    expect(stored.length).toBe(1);
  });

  test('should restore todos from storage', () => {
    const existingTodos = [
      { id: '1', description: 'Task', completed: false, createdAt: Date.now() }
    ];
    storage.set('todos', existingTodos);
    
    todoList.init(container);
    expect(todoList.getTodos()).toEqual(existingTodos);
  });
});
