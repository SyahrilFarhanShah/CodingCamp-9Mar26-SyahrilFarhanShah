/**
 * Theme Component
 * Manages Light/Dark mode toggle with persistence
 */

function createTheme() {
  let currentTheme = 'light';
  const STORAGE_KEY = 'theme-preference';

  /**
   * Initialize theme component
   */
  function init() {
    loadTheme();
    applyTheme();
    createThemeToggle();
  }

  /**
   * Load theme preference from storage
   */
  function loadTheme() {
    const storage = createStorage();
    const saved = storage.get(STORAGE_KEY);
    
    if (saved) {
      currentTheme = saved;
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        currentTheme = 'dark';
      } else {
        currentTheme = 'light';
      }
    }
  }

  /**
   * Save theme preference to storage
   */
  function saveTheme() {
    const storage = createStorage();
    storage.set(STORAGE_KEY, currentTheme);
  }

  /**
   * Apply theme to document
   */
  function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  /**
   * Toggle between light and dark mode
   */
  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme();
    saveTheme();
    updateToggleButton();
  }

  /**
   * Create and insert theme toggle button
   */
  function createThemeToggle() {
    const toggle = document.createElement('button');
    toggle.id = 'theme-toggle';
    toggle.className = 'theme-toggle-btn';
    toggle.setAttribute('aria-label', 'Toggle dark mode');
    updateToggleButton();
    
    toggle.addEventListener('click', toggleTheme);
    document.body.insertBefore(toggle, document.body.firstChild);
  }

  /**
   * Update toggle button appearance
   */
  function updateToggleButton() {
    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
      toggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
      toggle.title = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }
  }

  /**
   * Get current theme
   */
  function getTheme() {
    return currentTheme;
  }

  return {
    init,
    toggleTheme,
    getTheme
  };
}
