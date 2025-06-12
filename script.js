document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const colorInfo = document.getElementById('color-info');
    const solidBtn = document.getElementById('solid-btn');
    const gradientBtn = document.getElementById('gradient-btn');
    
    let mode = 'solid'; // Default mode: solid color
    let lastColor = null; // Track the last solid color used
    let lastGradient = { color1: null, color2: null }; // Track the last gradient colors used
    
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
    
    // Generate random color in hex format
    function getRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
    
    // Generate a drastically different color from the previous one
    function getDrasticColor(prevColor) {
        // Minimum distance threshold for colors to be considered "drastically different"
        const MIN_DISTANCE = 200; // Empirical value, higher means more contrast
        let attempts = 0;
        let newColor;
        
        do {
            newColor = getRandomColor();
            attempts++;
            
            // Prevent infinite loop - after many attempts, accept best candidate
            if (attempts > 20) break;
            
        } while (colorDistance(prevColor, newColor) < MIN_DISTANCE);
        
        return newColor;
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
});
