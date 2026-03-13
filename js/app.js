// ===================================
// Productivity Dashboard
// ===================================

// ===================================
// Application Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Productivity Dashboard loaded');
  
  try {
    // Initialize Theme first
    const theme = createTheme();
    theme.init();
    window.themeComponent = theme;
    
    // Initialize Storage
    const storage = createStorage();
    
    // Show storage error if any
    if (!storage.isAvailable()) {
      showNotification(storage.getError(), 'warning');
    }
    
    // Initialize Greeting Component
    const greetingContainer = document.getElementById('greeting');
    if (greetingContainer) {
      const greeting = createGreeting();
      greeting.init(greetingContainer);
      // Expose globally for edit name button
      window.greetingComponent = greeting;
    }
    
    // Initialize Timer Component
    const timerContainer = document.getElementById('timer');
    if (timerContainer) {
      const timer = createTimer(storage);
      timer.init(timerContainer);
    }
    
    // Initialize TodoList Component
    const todosContainer = document.getElementById('todos');
    if (todosContainer) {
      const todoList = createTodoList(storage);
      todoList.init(todosContainer);
    }
    
    // Initialize QuickLinks Component
    const quickLinksContainer = document.getElementById('quick-links');
    if (quickLinksContainer) {
      const quickLinks = createQuickLinks(storage);
      quickLinks.init(quickLinksContainer);
    }
    
    console.log('All components initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    showNotification('Failed to initialize application. Please refresh the page.', 'error');
  }
});

// ===================================
// Notification System
// ===================================

function showNotification(message, type = 'info') {
  const notificationArea = document.getElementById('notifications');
  if (!notificationArea) return;
  
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.setAttribute('role', 'alert');
  
  notificationArea.appendChild(notification);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
}
