# Monitor Test

A simple web-based tool for testing monitors by displaying fullscreen colors. 

## Features

- 🎨 Fills screen with random colors on click/tap
- 🌈 Supports both solid colors and gradients
- 🔄 Auto color change with configurable interval
- 🔗 URL parameter support for sharing specific configurations
- 📱 Works on both desktop and mobile devices

## How to Use

1. Visit the website
2. Click or tap anywhere on the screen to change the color
3. Use the buttons at the bottom to switch between solid colors and gradients
4. Toggle "Auto Change" to automatically cycle through colors
5. Adjust the interval slider to control how fast colors change (1-10 seconds)

## URL Parameters

You can configure the monitor test with URL parameters:

- `?auto=true` - Enable automatic color changing
- `?interval=5` - Set the interval in seconds (1-10)
- `?mode=gradient` - Set the color mode (solid or gradient)

Example: `https://yourusername.github.io/monitor-test/?auto=true&interval=3&mode=gradient`

## Local Development

To run locally:

```bash
make serve
```

Then open your browser to http://localhost:8000
