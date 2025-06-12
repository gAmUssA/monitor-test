document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const colorInfo = document.getElementById('color-info');
    const solidBtn = document.getElementById('solid-btn');
    const gradientBtn = document.getElementById('gradient-btn');
    const autoChangeCheckbox = document.getElementById('auto-change');
    const intervalSlider = document.getElementById('interval');
    const intervalValue = document.getElementById('interval-value');
    
    let mode = 'solid'; // Default mode: solid color
    let lastColor = null; // Track the last solid color used
    let lastGradient = { color1: null, color2: null }; // Track the last gradient colors used
    let autoChangeInterval = null; // Store the interval ID
    let changeIntervalSeconds = 5; // Default interval in seconds
    
    // Convert hex to RGB object
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse the hex values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    // Calculate color distance using color difference formula
    function colorDistance(color1, color2) {
        if (!color1 || !color2) return Infinity;
        
        const rgb1 = hexToRgb(color1);
        const rgb2 = hexToRgb(color2);
        
        // Calculate the Euclidean distance between colors in RGB space
        return Math.sqrt(
            Math.pow(rgb2.r - rgb1.r, 2) +
            Math.pow(rgb2.g - rgb1.g, 2) +
            Math.pow(rgb2.b - rgb1.b, 2)
        );
    }
    
    // List of vibrant colors suitable for lightbulbs
    const vibrantColors = [
        '#FF0000', // Red
        '#00FF00', // Lime Green
        '#0000FF', // Blue
        '#FFFF00', // Yellow
        '#FF00FF', // Magenta
        '#00FFFF', // Cyan
        '#FF8000', // Orange
        '#8000FF', // Purple
        '#0080FF', // Azure
        '#FF0080', // Rose
        '#00FF80', // Spring Green
        '#80FF00', // Chartreuse
        '#FF5500', // Deep Orange
        '#00CCFF', // Bright Sky Blue
        '#FF00CC'  // Hot Pink
    ];
    
    // Generate vibrant color
    function getRandomColor() {
        const colorIndex = Math.floor(Math.random() * vibrantColors.length);
        return vibrantColors[colorIndex];
    }
    
    // Keep track of the last few colors to avoid repetition
    let recentColors = [];
    const maxRecentColors = 5; // Don't repeat any of the last 5 colors
    
    // Generate a drastically different color from the previous one
    function getDrasticColor(prevColor) {
        // If no previous color, just return a random vibrant color
        if (!prevColor) {
            const color = getRandomColor();
            addToRecentColors(color);
            return color;
        }
        
        // Filter out recent colors to avoid repetition
        const availableColors = vibrantColors.filter(color => 
            !recentColors.includes(color) && color !== prevColor
        );
        
        // If we've used up too many colors, reset and just avoid the previous color
        const colorPool = availableColors.length > 0 ? 
            availableColors : 
            vibrantColors.filter(color => color !== prevColor);
        
        if (colorPool.length === 0) {
            // Extreme fallback - just get a random color
            const color = getRandomColor();
            addToRecentColors(color);
            return color;
        }
        
        // Find colors with good contrast
        const goodContrastColors = [];
        const MIN_CONTRAST = 200;
        
        colorPool.forEach(color => {
            const contrast = colorDistance(prevColor, color);
            if (contrast > MIN_CONTRAST) {
                // Add high contrast colors to our selection pool
                // Weight higher contrast colors by adding them multiple times
                const weight = Math.floor(contrast / 50); // Add once per 50 units of contrast
                for (let i = 0; i < weight; i++) {
                    goodContrastColors.push(color);
                }
            }
        });
        
        // Pick a random color from our weighted list of good contrast colors
        // Or fall back to the filtered color pool if none have good contrast
        const selectionPool = goodContrastColors.length > 0 ? goodContrastColors : colorPool;
        const selectedColor = selectionPool[Math.floor(Math.random() * selectionPool.length)];
        
        // Remember this color to avoid repeating it too soon
        addToRecentColors(selectedColor);
        
        return selectedColor;
    }
    
    // Helper function to maintain our recent colors list
    function addToRecentColors(color) {
        recentColors.push(color);
        if (recentColors.length > maxRecentColors) {
            recentColors.shift(); // Remove oldest color
        }
    }
    
    // Generate random gradient with colors drastically different from previous ones
    function getRandomGradient() {
        const color1 = getDrasticColor(lastGradient.color1);
        const color2 = getDrasticColor(lastGradient.color2);
        const angle = Math.floor(Math.random() * 360);
        
        return {
            gradient: `linear-gradient(${angle}deg, ${color1}, ${color2})`,
            color1: color1,
            color2: color2,
            angle: angle
        };
    }
    
    // Apply solid color
    function applySolidColor() {
        const color = getDrasticColor(lastColor);
        lastColor = color; // Save the new color
        
        screen.style.background = color;
        colorInfo.textContent = `Current Color: ${color}`;
    }
    
    // Apply gradient color
    function applyGradientColor() {
        const { gradient, color1, color2, angle } = getRandomGradient();
        lastGradient = { color1, color2 }; // Save the new gradient colors
        
        screen.style.background = gradient;
        colorInfo.textContent = `Gradient: ${angle}° from ${color1} to ${color2}`;
    }
    
    // Handle click/tap event
    function handleScreenClick() {
        if (mode === 'solid') {
            applySolidColor();
        } else {
            applyGradientColor();
        }
    }
    
    // Add event listeners
    screen.addEventListener('click', handleScreenClick);
    
    // Mode selection
    solidBtn.addEventListener('click', () => {
        mode = 'solid';
        solidBtn.classList.add('active');
        gradientBtn.classList.remove('active');
        applySolidColor();
    });
    
    gradientBtn.addEventListener('click', () => {
        mode = 'gradient';
        gradientBtn.classList.add('active');
        solidBtn.classList.remove('active');
        applyGradientColor();
    });
    
    // Initialize with a random color
    applySolidColor();
    
    // Parse URL parameters to apply settings
    function getURLParams() {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for auto change parameter
        if (urlParams.has('auto')) {
            autoChangeCheckbox.checked = urlParams.get('auto') === 'true';
        }
        
        // Check for interval parameter
        if (urlParams.has('interval')) {
            const intervalParam = parseInt(urlParams.get('interval'));
            if (!isNaN(intervalParam) && intervalParam >= 1 && intervalParam <= 10) {
                changeIntervalSeconds = intervalParam;
                intervalSlider.value = intervalParam;
                intervalValue.textContent = `${intervalParam}s`;
            }
        }
        
        // Check for color mode parameter
        if (urlParams.has('mode')) {
            const modeParam = urlParams.get('mode');
            if (modeParam === 'gradient') {
                mode = 'gradient';
                solidBtn.classList.remove('active');
                gradientBtn.classList.add('active');
                applyGradientColor();
            }
        }
        
        // Apply auto change if set to true
        if (autoChangeCheckbox.checked) {
            startAutoChange();
        }
    }
    
    // Update the URL with current settings
    function updateURL() {
        const urlParams = new URLSearchParams();
        urlParams.set('auto', autoChangeCheckbox.checked);
        urlParams.set('interval', changeIntervalSeconds);
        urlParams.set('mode', mode);
        
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
    }
    
    // Start auto color changes
    function startAutoChange() {
        if (autoChangeInterval) {
            clearInterval(autoChangeInterval);
        }
        
        autoChangeInterval = setInterval(() => {
            if (mode === 'solid') {
                applySolidColor();
            } else {
                applyGradientColor();
            }
        }, changeIntervalSeconds * 1000);
    }
    
    // Stop auto color changes
    function stopAutoChange() {
        if (autoChangeInterval) {
            clearInterval(autoChangeInterval);
            autoChangeInterval = null;
        }
    }
    
    // Event listener for auto change checkbox
    autoChangeCheckbox.addEventListener('change', () => {
        if (autoChangeCheckbox.checked) {
            startAutoChange();
        } else {
            stopAutoChange();
        }
        updateURL();
    });
    
    // Event listener for interval slider
    intervalSlider.addEventListener('input', () => {
        changeIntervalSeconds = parseInt(intervalSlider.value);
        intervalValue.textContent = `${changeIntervalSeconds}s`;
        
        if (autoChangeInterval) {
            stopAutoChange();
            startAutoChange();
        }
        updateURL();
    });
    
    // Initialize URL parameters
    getURLParams();
});
