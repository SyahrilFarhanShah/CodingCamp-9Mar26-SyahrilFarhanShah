/**
 * QuickLinks Component
 * Manages quick links to frequently visited websites
 * 
 * **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7**
 */

function createQuickLinks(storage) {
  let links = [];
  let containerElement = null;

  /**
   * Generate unique ID for link items
   * @returns {string} Unique identifier
   */
  function generateId() {
    return `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Validate URL format
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid
   */
  function isValidUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch (e) {
      return false;
    }
  }

  /**
   * Initialize component and restore links from storage
   * @param {HTMLElement} container - DOM container element
   */
  function init(container) {
    containerElement = container;
    restoreLinks();
    render();
  }

  /**
   * Add new quick link
   * @param {string} name - Display name
   * @param {string} url - URL
   * @returns {boolean} True if successfully added
   */
  function addLink(name, url) {
    if (!name || name.trim().length === 0 || name.length > 100) {
      return false;
    }

    if (!isValidUrl(url)) {
      return false;
    }

    const link = {
      id: generateId(),
      name: name.trim(),
      url: url,
      createdAt: Date.now()
    };

    links.push(link);
    saveLinks();
    render();
    return true;
  }

  /**
   * Delete link
   * @param {string} id - Link ID
   */
  function deleteLink(id) {
    const initialLength = links.length;
    links = links.filter(l => l.id !== id);
    
    if (links.length !== initialLength) {
      saveLinks();
      render();
    }
  }

  /**
   * Render all links to DOM
   */
  function render() {
    if (!containerElement) {
      return;
    }

    containerElement.innerHTML = `
      <div class="quicklinks">
        <h2>Quick Links</h2>
        <div class="link-input-container">
          <input type="text" id="link-name-input" placeholder="Name" />
          <input type="text" id="link-url-input" placeholder="https://example.com" />
          <button id="link-add-btn">Add</button>
        </div>
        <ul class="link-list" id="link-list"></ul>
      </div>
    `;

    const list = containerElement.querySelector('#link-list');
    const nameInput = containerElement.querySelector('#link-name-input');
    const urlInput = containerElement.querySelector('#link-url-input');
    const addBtn = containerElement.querySelector('#link-add-btn');

    // Render links
    links.forEach(link => {
      const item = document.createElement('li');
      item.className = 'link-item';
      item.dataset.id = link.id;

      item.innerHTML = `
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-anchor">
          ${escapeHtml(link.name)}
        </a>
        <button class="link-delete-btn">Delete</button>
      `;

      const deleteBtn = item.querySelector('.link-delete-btn');
      deleteBtn.addEventListener('click', () => deleteLink(link.id));

      list.appendChild(item);
    });

    // Add link event listeners
    const handleAdd = () => {
      const name = nameInput.value;
      const url = urlInput.value;
      
      if (addLink(name, url)) {
        nameInput.value = '';
        urlInput.value = '';
      } else {
        if (!name || name.trim().length === 0) {
          alert('Link name cannot be empty');
        } else if (!isValidUrl(url)) {
          alert('Please enter a valid URL starting with http:// or https://');
        }
      }
    };

    addBtn.addEventListener('click', handleAdd);
    urlInput.addEventListener('keypress', (e) => {
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
   * Save links to storage
   */
  function saveLinks() {
    storage.set('quick-links', links);
  }

  /**
   * Restore links from storage
   */
  function restoreLinks() {
    const stored = storage.get('quick-links');
    if (stored && Array.isArray(stored)) {
      links = stored;
    } else {
      links = [];
    }
  }

  /**
   * Get all links (for testing)
   * @returns {Array} Array of link objects
   */
  function getLinks() {
    return [...links];
  }

  return {
    init,
    addLink,
    deleteLink,
    render,
    saveLinks,
    restoreLinks,
    isValidUrl,
    getLinks
  };
}


