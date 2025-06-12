document.addEventListener('DOMContentLoaded', () => {
    const screen = document.getElementById('screen');
    const colorInfo = document.getElementById('color-info');
    const solidBtn = document.getElementById('solid-btn');
    const gradientBtn = document.getElementById('gradient-btn');
    
    let mode = 'solid'; // Default mode: solid color
    
    // Generate random color in hex format
    function getRandomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    }
    
    // Generate random gradient
    function getRandomGradient() {
        const color1 = getRandomColor();
        const color2 = getRandomColor();
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
        const color = getRandomColor();
        screen.style.background = color;
        colorInfo.textContent = `Current Color: ${color}`;
    }
    
    // Apply gradient color
    function applyGradientColor() {
        const { gradient, color1, color2, angle } = getRandomGradient();
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
