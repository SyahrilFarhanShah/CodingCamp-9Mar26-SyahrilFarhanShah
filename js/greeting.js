/**
 * Greeting Component
 * Displays current time, date, and time-appropriate greeting with custom name
 * 
 * **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6**
 */

function createGreeting() {
  let containerElement = null;
  let intervalId = null;
  let userName = '';

  /**
   * Initialize component and start clock
   * @param {HTMLElement} container - DOM container element
   */
  function init(container) {
    containerElement = container;
    loadUserName();
    updateTime();
    // Update every second
    intervalId = setInterval(updateTime, 1000);
  }

  /**
   * Update time display
   */
  function updateTime() {
    if (!containerElement) return;

    const now = new Date();
    const greeting = getGreeting(now);
    const timeStr = formatTime(now);
    const dateStr = formatDate(now);
    const greetingText = userName ? `${greeting}, ${userName}!` : greeting;

    containerElement.innerHTML = `
      <div class="greeting">
        <div class="time">${timeStr}</div>
        <div class="date">${dateStr}</div>
        <h1 class="greeting-text">${greetingText}</h1>
        <button class="edit-name-btn" onclick="window.greetingComponent.editName()">Edit Name</button>
      </div>
    `;
  }

  /**
   * Edit user name
   */
  function editName() {
    const newName = prompt('Enter your name:', userName);
    if (newName !== null) {
      userName = newName.trim();
      if (userName.length > 50) {
        userName = userName.substring(0, 50);
      }
      saveUserName();
      updateTime();
    }
  }

  /**
   * Save user name to storage
   */
  function saveUserName() {
    const storage = createStorage();
    storage.set('user-name', userName);
  }

  /**
   * Load user name from storage
   */
  function loadUserName() {
    const storage = createStorage();
    const saved = storage.get('user-name');
    if (saved) {
      userName = saved;
    }
  }

  /**
   * Get appropriate greeting based on current time
   * @param {Date} date - Date object
   * @returns {string} Greeting message
   */
  function getGreeting(date) {
    const hours = date.getHours();
    
    // Morning: 5:00 AM - 11:59 AM
    if (hours >= 5 && hours < 12) {
      return 'Good morning';
    }
    // Afternoon: 12:00 PM - 4:59 PM
    else if (hours >= 12 && hours < 17) {
      return 'Good afternoon';
    }
    // Evening: 5:00 PM - 4:59 AM
    else {
      return 'Good evening';
    }
  }

  /**
   * Format time in 12-hour format with AM/PM
   * @param {Date} date - Date object
   * @returns {string} Formatted time string
   */
  function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    // Pad with zeros
    const minutesStr = String(minutes).padStart(2, '0');
    const secondsStr = String(seconds).padStart(2, '0');
    
    return `${hours}:${minutesStr}:${secondsStr} ${ampm}`;
  }

  /**
   * Format date in human-readable format
   * @param {Date} date - Date object
   * @returns {string} Formatted date string
   */
  function formatDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();
    
    return `${dayName}, ${monthName} ${dayNum}, ${year}`;
  }

  /**
   * Cleanup - stop interval
   */
  function destroy() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return {
    init,
    updateTime,
    getGreeting,
    formatTime,
    formatDate,
    editName,
    destroy
  };
}


