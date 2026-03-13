/**
 * Timer Component
 * 25-minute Pomodoro countdown timer with persistence
 * 
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7**
 */

function createTimer(storage) {
  const INITIAL_SECONDS = 1500; // 25 minutes
  let remainingSeconds = INITIAL_SECONDS;
  let isRunning = false;
  let intervalId = null;
  let containerElement = null;

  /**
   * Initialize component and restore state
   * @param {HTMLElement} container - DOM container element
   */
  function init(container) {
    containerElement = container;
    restoreState();
    render();
  }

  /**
   * Start or resume timer
   */
  function start() {
    if (!isRunning) {
      isRunning = true;
      saveState();
      intervalId = setInterval(tick, 1000);
      render();
    }
  }

  /**
   * Pause timer
   */
  function stop() {
    if (isRunning) {
      isRunning = false;
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      saveState();
      render();
    }
  }

  /**
   * Reset timer to 25:00
   */
  function reset() {
    isRunning = false;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    remainingSeconds = INITIAL_SECONDS;
    saveState();
    render();
  }

  /**
   * Update display (called every second when running)
   */
  function tick() {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      saveState();
      render();
      
      if (remainingSeconds === 0) {
        stop();
        showNotification();
      }
    }
  }

  /**
   * Format seconds as MM:SS
   * @param {number} seconds - Seconds to format
   * @returns {string} Formatted time string
   */
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  /**
   * Render timer to DOM
   */
  function render() {
    if (!containerElement) return;

    const timeStr = formatTime(remainingSeconds);
    const statusClass = isRunning ? 'running' : 'stopped';

    containerElement.innerHTML = `
      <div class="timer ${statusClass}">
        <h2>Focus Timer</h2>
        <div class="timer-display">${timeStr}</div>
        <div class="timer-controls">
          <button id="timer-start" ${isRunning ? 'disabled' : ''}>Start</button>
          <button id="timer-stop" ${!isRunning ? 'disabled' : ''}>Stop</button>
          <button id="timer-reset">Reset</button>
        </div>
      </div>
    `;

    // Attach event listeners
    const startBtn = containerElement.querySelector('#timer-start');
    const stopBtn = containerElement.querySelector('#timer-stop');
    const resetBtn = containerElement.querySelector('#timer-reset');

    if (startBtn) startBtn.addEventListener('click', start);
    if (stopBtn) stopBtn.addEventListener('click', stop);
    if (resetBtn) resetBtn.addEventListener('click', reset);
  }

  /**
   * Save current state to storage
   */
  function saveState() {
    storage.set('timer-state', {
      remainingSeconds,
      isRunning,
      lastUpdate: Date.now()
    });
  }

  /**
   * Restore state from storage
   */
  function restoreState() {
    const state = storage.get('timer-state');
    if (state) {
      remainingSeconds = state.remainingSeconds;
      
      if (state.isRunning) {
        // Calculate elapsed time
        const elapsed = Math.floor((Date.now() - state.lastUpdate) / 1000);
        remainingSeconds = Math.max(0, remainingSeconds - elapsed);
        
        if (remainingSeconds > 0) {
          start();
        } else {
          remainingSeconds = 0;
          isRunning = false;
          showNotification();
        }
      }
    }
  }

  /**
   * Show completion notification
   */
  function showNotification() {
    const notificationArea = document.getElementById('notifications');
    if (notificationArea) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = 'Timer completed! Time for a break.';
      notificationArea.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 5000);
    }
  }

  /**
   * Get current state (for testing)
   */
  function getState() {
    return {
      remainingSeconds,
      isRunning
    };
  }

  /**
   * Cleanup
   */
  function destroy() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  return {
    init,
    start,
    stop,
    reset,
    tick,
    formatTime,
    saveState,
    restoreState,
    showNotification,
    getState,
    destroy,
    render
  };
}


