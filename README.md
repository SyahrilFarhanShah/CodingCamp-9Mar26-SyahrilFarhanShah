# Productivity Dashboard

A minimal, clean productivity dashboard built with vanilla JavaScript. Features a greeting display, 25-minute Pomodoro timer, to-do list, and quick links manager.

## Features

- **Personalized Greeting** - Time-based greeting with current time and date
- **Pomodoro Timer** - 25-minute focus timer with start/stop/reset controls
- **To-Do List** - Add, edit, mark complete, and delete tasks
- **Quick Links** - Manage frequently visited websites with one-click access
- **Data Persistence** - All data saved to Local Storage with in-memory fallback
- **Offline Support** - Works completely offline after initial load
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **No Dependencies** - Pure vanilla JavaScript, no frameworks or libraries

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/productivity-dashboard.git
cd productivity-dashboard
```

2. Open `index.html` in your browser:
```bash
# On macOS
open index.html

# On Windows
start index.html

# On Linux
xdg-open index.html
```

Or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server
```

Then visit `http://localhost:8000` in your browser.

### Running Tests

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test suite
npm test -- storage.test.js
npm test -- greeting.test.js
npm test -- timer.test.js
npm test -- todolist.test.js
npm test -- quicklinks.test.js
```

## Project Structure

```
productivity-dashboard/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # All styling
├── js/
│   ├── app.js           # Application initialization
│   ├── storage.js       # Storage layer with fallback
│   ├── greeting.js      # Greeting component
│   ├── timer.js         # Timer component
│   ├── todolist.js      # TodoList component
│   ├── quicklinks.js    # QuickLinks component
│   └── *.test.js        # Test files
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Pages deployment
└── README.md            # This file
```

## Usage

### Greeting Component
- Displays current time in 12-hour format
- Shows current date with day name
- Time-appropriate greeting (morning/afternoon/evening)
- Updates automatically every second

### Timer Component
- 25-minute Pomodoro timer
- Start, stop, and reset controls
- Continues running even if you navigate away
- Notification when timer completes
- State persists across page reloads

### To-Do List
- Add tasks by typing and pressing Enter or clicking Add
- Edit tasks by clicking the Edit button
- Mark tasks complete by clicking the checkbox
- Delete tasks by clicking the Delete button
- All tasks saved automatically

### Quick Links
- Add links by entering name and URL
- URLs must start with http:// or https://
- Click links to open in new tab
- Delete links by clicking the Delete button
- All links saved automatically

## Data Storage

All data is stored in the browser's Local Storage:
- `timer-state` - Current timer state and last update time
- `todos` - Array of todo items
- `quick-links` - Array of quick link items

If Local Storage is unavailable, data is stored in memory for the current session.

## Browser Support

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## Deployment

### GitHub Pages

1. Push your code to GitHub:
```bash
git push origin main
```

2. Enable GitHub Pages in repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/" (root) folder
   - Click Save

3. The site will be deployed to `https://yourusername.github.io/productivity-dashboard`

### Custom Domain

To use a custom domain:
1. Update the `cname` field in `.github/workflows/deploy.yml`
2. Add DNS records pointing to GitHub Pages
3. Enable custom domain in repository settings

## Testing

The project includes comprehensive tests using Jest and fast-check for property-based testing:

- **Storage Module** - 16 tests covering persistence and fallback
- **Greeting Component** - 17 tests for time/date formatting and greetings
- **Timer Component** - 5 tests for countdown and persistence
- **TodoList Component** - 8 tests for CRUD operations
- **QuickLinks Component** - 6 tests for link management

All tests validate correctness properties defined in the design document.

## Performance

- Initial load: < 1 second
- Interactions: < 100ms response time
- Timer accuracy: ±1 second
- No external dependencies or build process

## Accessibility

- Semantic HTML structure
- ARIA labels for live regions
- Keyboard navigation support
- Focus indicators on all interactive elements
- Color contrast meets WCAG standards

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with vanilla JavaScript, no frameworks, no build tools. Just pure productivity.
