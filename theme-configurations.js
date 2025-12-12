// Theme Configurations JavaScript
// Handles switching between 20 unique design configurations

// Configuration metadata
const configurations = {
    1: { name: 'Classic Dark Mode', description: 'Modern dark theme with blue/purple accents' },
    2: { name: 'Light & Minimal', description: 'Clean white background with subtle shadows' },
    3: { name: 'High Contrast', description: 'Accessibility-focused black/white/yellow' },
    4: { name: 'Retro 80s Neon', description: 'Vibrant neon colors with glowing effects' },
    5: { name: 'Forest Green', description: 'Nature-inspired green tones' },
    6: { name: 'Ocean Blue', description: 'Deep blue ocean-themed design' },
    7: { name: 'Sunset Warm', description: 'Warm orange and red sunset colors' },
    8: { name: 'Monochrome', description: 'Black and white only, no colors' },
    9: { name: 'Cyberpunk', description: 'Futuristic purple/pink neon tech style' },
    10: { name: 'Pastel Soft', description: 'Soft pastel colors for gentle viewing' },
    11: { name: 'Material Design', description: 'Google Material Design inspired' },
    12: { name: 'Neumorphism', description: 'Soft UI with subtle shadows and highlights' },
    13: { name: 'Glassmorphism', description: 'Frosted glass effect with transparency' },
    14: { name: 'Card-Based Layout', description: 'Distinct card-based widget layout' },
    15: { name: 'Sidebar Navigation', description: 'Left sidebar navigation structure' },
    16: { name: 'Compact Dense', description: 'Information-dense compact layout' },
    17: { name: 'Large Text Mode', description: 'Readability-focused large typography' },
    18: { name: 'Gradient Heavy', description: 'Vibrant gradients throughout design' },
    19: { name: 'Split Screen', description: 'Unique split-screen column layout' },
    20: { name: 'Magazine Style', description: 'Editorial magazine-inspired design' }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSelector();
    loadSavedConfiguration();
});

// Initialize the selector panel
function initializeSelector() {
    // Add click listeners to all config buttons
    const configButtons = document.querySelectorAll('.config-btn');
    configButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => switchConfig(index + 1));
    });
    
    // Initialize toggle button
    const toggleBtn = document.querySelector('.toggle-selector');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSelector);
    }
}

// Switch to a different configuration
function switchConfig(configNumber) {
    // Validate config number
    if (configNumber < 1 || configNumber > 20) {
        console.error('Invalid configuration number:', configNumber);
        return;
    }
    
    // Update body data attribute
    document.body.setAttribute('data-config', `config-${configNumber}`);
    
    // Update active button
    const configButtons = document.querySelectorAll('.config-btn');
    configButtons.forEach((btn, index) => {
        if (index + 1 === configNumber) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update config name display
    const configNameDisplay = document.getElementById('current-config-name');
    if (configNameDisplay && configurations[configNumber]) {
        configNameDisplay.textContent = configurations[configNumber].name;
    }
    
    // Save to localStorage
    localStorage.setItem('selectedConfiguration', configNumber);
    
    // Show notification
    showConfigNotification(configNumber);
    
    // Log for debugging
    console.log(`Switched to Configuration ${configNumber}: ${configurations[configNumber].name}`);
}

// Toggle selector panel visibility
function toggleSelector() {
    const panel = document.querySelector('.config-selector-panel');
    const toggleIcon = document.getElementById('toggle-icon');
    
    if (panel.classList.contains('hidden')) {
        panel.classList.remove('hidden');
        toggleIcon.textContent = '◀';
    } else {
        panel.classList.add('hidden');
        toggleIcon.textContent = '▶';
    }
    
    // Save state to localStorage
    localStorage.setItem('selectorHidden', panel.classList.contains('hidden'));
}

// Load saved configuration from localStorage
function loadSavedConfiguration() {
    const savedConfig = localStorage.getItem('selectedConfiguration');
    const selectorHidden = localStorage.getItem('selectorHidden') === 'true';
    
    // Restore selector state
    const panel = document.querySelector('.config-selector-panel');
    const toggleIcon = document.getElementById('toggle-icon');
    if (selectorHidden && panel) {
        panel.classList.add('hidden');
        if (toggleIcon) toggleIcon.textContent = '▶';
    }
    
    // Restore configuration
    if (savedConfig) {
        switchConfig(parseInt(savedConfig));
    } else {
        // Default to configuration 1
        switchConfig(1);
    }
}

// Show configuration change notification
function showConfigNotification(configNumber) {
    const config = configurations[configNumber];
    if (!config) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'config-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-title">Configuration ${configNumber}</span>
            <span class="notification-subtitle">${config.name}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.75rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .notification-title {
        font-weight: 700;
        font-size: 1rem;
    }
    
    .notification-subtitle {
        font-size: 0.875rem;
        opacity: 0.9;
    }
    
    /* Responsive styles */
    @media (max-width: 768px) {
        .config-selector-panel {
            width: 100%;
            height: auto;
            max-height: 80vh;
        }
        
        .dashboard-container {
            margin-left: 0;
            margin-top: 0;
        }
        
        .config-selector-panel:not(.hidden) + .dashboard-container {
            display: none;
        }
        
        .toggle-selector {
            top: auto;
            bottom: 20px;
            right: 20px;
            left: auto;
            transform: none;
            width: 60px;
            height: 60px;
            border-radius: 50%;
        }
    }
`;
document.head.appendChild(style);

// Export configuration information
function getConfigurationInfo(configNumber) {
    return configurations[configNumber] || null;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Number keys to switch configurations
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        switchConfig(parseInt(e.key));
    }
    
    // Ctrl/Cmd + 0 for config 10
    if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        switchConfig(10);
    }
    
    // Ctrl/Cmd + S to toggle selector
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        toggleSelector();
    }
});

// Add help information to console
console.log(`
╔══════════════════════════════════════════════════════════╗
║  20 Unique Design Configurations                         ║
║  Cross-Canada Journey Dashboard                          ║
╚══════════════════════════════════════════════════════════╝

Keyboard Shortcuts:
  Ctrl/Cmd + 1-9: Switch to configuration 1-9
  Ctrl/Cmd + 0: Switch to configuration 10
  Ctrl/Cmd + S: Toggle selector panel

Available Configurations:
`);

for (let i = 1; i <= 20; i++) {
    console.log(`  ${i}. ${configurations[i].name} - ${configurations[i].description}`);
}

console.log('\n🎨 Explore all 20 unique designs!\n');
