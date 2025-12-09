// ===== Cross-Canada Travel Dashboard JavaScript =====

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    updateCountdown();
    setInterval(updateCountdown, 60000); // Update every minute
    loadSavedProgress();
    loadCheckboxStates();
});

// ===== Dashboard Initialization =====
function initializeDashboard() {
    // Add staggered animation delays to widgets
    const widgets = document.querySelectorAll('.widget');
    widgets.forEach((widget, index) => {
        widget.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Initialize date inputs with validation
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    startDateInput.addEventListener('change', validateDates);
    endDateInput.addEventListener('change', validateDates);
    
    // Save checkbox states
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', saveCheckboxStates);
    });
    
    console.log('Dashboard initialized successfully!');
}

// ===== Countdown Timer =====
function updateCountdown() {
    const targetDate = new Date('2024-12-18T00:00:00');
    const now = new Date();
    const difference = targetDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    const countdownElement = document.getElementById('countdown');
    const daysCountElement = document.getElementById('days-count');
    
    if (difference > 0) {
        countdownElement.textContent = `${days} days, ${hours} hours`;
        daysCountElement.textContent = 'Time until Mom\'s birthday (Dec 18):';
    } else {
        countdownElement.textContent = 'Happy Birthday Mom! 🎂';
        daysCountElement.textContent = '';
        countdownElement.style.color = 'var(--success-color)';
    }
}

// ===== Date Validation =====
function validateDates() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const targetDate = new Date('2024-12-18');
    
    if (endDate < startDate) {
        alert('End date cannot be before start date!');
        document.getElementById('end-date').value = document.getElementById('start-date').value;
    }
    
    if (endDate > targetDate) {
        const confirmLate = confirm('Warning: Your arrival date is after Mom\'s birthday (Dec 18). Do you want to continue?');
        if (!confirmLate) {
            document.getElementById('end-date').value = '2024-12-15';
        }
    }
    
    calculateTripDuration();
}

// ===== Calculate Trip Duration =====
function calculateTripDuration() {
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Update the header badge if needed
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (badge.textContent.includes('Days')) {
            badge.textContent = `${diffDays} Days`;
        }
    });
}

// ===== Widget Toggle Functionality =====
function toggleWidget(widgetId) {
    const widget = document.getElementById(widgetId);
    const content = widget.querySelector('.widget-content');
    const toggleBtn = widget.querySelector('.toggle-btn');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        toggleBtn.textContent = '−';
    } else {
        content.classList.add('collapsed');
        toggleBtn.textContent = '+';
    }
}

// ===== Day Toggle Functionality =====
function toggleDay(dayNumber) {
    const dayDetails = document.getElementById(`day-${dayNumber}`);
    
    if (dayDetails.classList.contains('active')) {
        dayDetails.classList.remove('active');
    } else {
        // Close all other days
        document.querySelectorAll('.day-details').forEach(detail => {
            detail.classList.remove('active');
        });
        // Open clicked day
        dayDetails.classList.add('active');
    }
}

// ===== Progress Tracker =====
function updateProgress() {
    const distanceCovered = parseInt(document.getElementById('distance-covered').value) || 0;
    const totalDistance = 3000;
    
    // Validate input
    if (distanceCovered > totalDistance) {
        document.getElementById('distance-covered').value = totalDistance;
        return updateProgress();
    }
    
    if (distanceCovered < 0) {
        document.getElementById('distance-covered').value = 0;
        return updateProgress();
    }
    
    const percentage = (distanceCovered / totalDistance) * 100;
    const remaining = totalDistance - distanceCovered;
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${percentage}%`;
    
    // Update progress text
    const progressText = progressFill.querySelector('.progress-text');
    progressText.textContent = `${Math.round(percentage)}%`;
    
    // Update stats
    document.getElementById('distance-display').textContent = `${distanceCovered.toLocaleString()} km`;
    document.getElementById('remaining-display').textContent = `${remaining.toLocaleString()} km`;
    
    // Save to localStorage
    localStorage.setItem('tripProgress', distanceCovered);
    
    // Celebrate milestones
    checkMilestones(percentage);
}

// ===== Milestone Celebrations =====
function checkMilestones(percentage) {
    const milestones = [25, 50, 75, 100];
    const lastMilestone = parseInt(localStorage.getItem('lastMilestone')) || 0;
    
    milestones.forEach(milestone => {
        if (percentage >= milestone && lastMilestone < milestone) {
            showMilestoneMessage(milestone);
            localStorage.setItem('lastMilestone', milestone);
        }
    });
}

function showMilestoneMessage(milestone) {
    const messages = {
        25: '🎉 Quarter of the way there! Keep going!',
        50: '🎊 Halfway to Mom! You\'re doing great!',
        75: '🌟 Three-quarters done! Almost there!',
        100: '🎂 You made it! Happy birthday Mom! 💝'
    };
    
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = 'milestone-toast';
    toast.textContent = messages[milestone];
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--success-color), var(--primary-color));
        color: white;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        font-weight: 600;
        font-size: 1.125rem;
        z-index: 9999;
        animation: slideInRight 0.5s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    // Remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
}

// ===== Load Saved Progress =====
function loadSavedProgress() {
    const savedProgress = localStorage.getItem('tripProgress');
    if (savedProgress) {
        document.getElementById('distance-covered').value = savedProgress;
        updateProgress();
    }
}

// ===== Save Checkbox States =====
function saveCheckboxStates() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const states = {};
    
    checkboxes.forEach(checkbox => {
        if (checkbox.id) {
            states[checkbox.id] = checkbox.checked;
        }
    });
    
    localStorage.setItem('checkboxStates', JSON.stringify(states));
    updateChecklistProgress();
}

// ===== Load Checkbox States =====
function loadCheckboxStates() {
    const savedStates = localStorage.getItem('checkboxStates');
    
    if (savedStates) {
        const states = JSON.parse(savedStates);
        
        Object.keys(states).forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) {
                checkbox.checked = states[id];
            }
        });
        
        updateChecklistProgress();
    }
}

// ===== Update Checklist Progress =====
function updateChecklistProgress() {
    const checkboxes = document.querySelectorAll('#safety input[type="checkbox"]');
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = Math.round((checked / total) * 100);
    
    // Update safety widget header with progress
    const safetyHeader = document.querySelector('#safety .widget-header h3');
    if (safetyHeader && !safetyHeader.dataset.originalText) {
        safetyHeader.dataset.originalText = safetyHeader.textContent;
    }
    
    if (safetyHeader) {
        const originalText = safetyHeader.dataset.originalText || '🛡️ Safety Checklist & Winter Tips';
        safetyHeader.innerHTML = `${originalText} <span style="color: var(--success-color); font-size: 0.875rem; margin-left: 0.5rem;">(${checked}/${total} completed)</span>`;
    }
}

// ===== Export Trip Data =====
function exportTripData() {
    const tripData = {
        dates: {
            start: document.getElementById('start-date').value,
            end: document.getElementById('end-date').value
        },
        progress: {
            distanceCovered: document.getElementById('distance-covered').value,
            percentage: Math.round((parseInt(document.getElementById('distance-covered').value) / 3000) * 100)
        },
        safetyChecklist: JSON.parse(localStorage.getItem('checkboxStates') || '{}'),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(tripData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `cross-canada-trip-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
}

// ===== Print Dashboard =====
function printDashboard() {
    // Expand all collapsed widgets before printing
    const collapsedWidgets = document.querySelectorAll('.widget-content.collapsed');
    collapsedWidgets.forEach(widget => {
        widget.classList.remove('collapsed');
    });
    
    window.print();
    
    // Restore collapsed state after printing
    setTimeout(() => {
        collapsedWidgets.forEach(widget => {
            widget.classList.add('collapsed');
        });
    }, 100);
}

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P for print
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printDashboard();
    }
    
    // Ctrl/Cmd + E for export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportTripData();
    }
    
    // Escape to close all expanded days
    if (e.key === 'Escape') {
        document.querySelectorAll('.day-details.active').forEach(detail => {
            detail.classList.remove('active');
        });
    }
});

// ===== Smooth Scroll to Widget =====
function scrollToWidget(widgetId) {
    const widget = document.getElementById(widgetId);
    if (widget) {
        widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight widget briefly
        widget.style.boxShadow = '0 0 0 4px var(--primary-color)';
        setTimeout(() => {
            widget.style.boxShadow = '';
        }, 1000);
    }
}

// ===== Weather Data Update (Placeholder for API integration) =====
function updateWeatherData() {
    // This function can be extended to fetch real weather data from an API
    // For now, it uses the static data from the HTML
    console.log('Weather data is currently static. Integrate with weather API for live updates.');
}

// ===== Gas Price Calculator =====
function calculateGasCost(distanceTraveled) {
    const fuelEfficiency = 25; // MPG in winter
    const pricePerLiter = 1.70; // CAD average
    const litersPerGallon = 3.785;
    
    const gallonsNeeded = distanceTraveled / 1.60934 / fuelEfficiency;
    const litersNeeded = gallonsNeeded * litersPerGallon;
    const totalCost = litersNeeded * pricePerLiter;
    
    return {
        liters: Math.round(litersNeeded),
        cost: Math.round(totalCost)
    };
}

// ===== Add Dynamic Stats Update =====
function updateTripStats() {
    const distanceCovered = parseInt(document.getElementById('distance-covered').value) || 0;
    const gasInfo = calculateGasCost(distanceCovered);
    
    console.log(`Distance covered: ${distanceCovered} km`);
    console.log(`Fuel used: ${gasInfo.liters} L`);
    console.log(`Cost so far: $${gasInfo.cost} CAD`);
}

// ===== Animation CSS for Toast =====
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
`;
document.head.appendChild(style);

// ===== Service Worker Registration (for offline capability) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Optional: Implement service worker for offline functionality
        console.log('Service worker support detected. Offline mode can be implemented.');
    });
}

// ===== Debug Mode =====
const DEBUG = false;

if (DEBUG) {
    console.log('Debug mode enabled');
    
    // Add debug panel
    const debugPanel = document.createElement('div');
    debugPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #0f0;
        padding: 1rem;
        border-radius: 0.5rem;
        font-family: monospace;
        font-size: 0.75rem;
        max-width: 300px;
        z-index: 9999;
    `;
    
    setInterval(() => {
        debugPanel.innerHTML = `
            <strong>Debug Info:</strong><br>
            Progress: ${document.getElementById('distance-covered').value} km<br>
            Widgets: ${document.querySelectorAll('.widget').length}<br>
            Checkboxes: ${document.querySelectorAll('input[type="checkbox"]:checked').length}/${document.querySelectorAll('input[type="checkbox"]').length}<br>
            LocalStorage: ${Object.keys(localStorage).length} items
        `;
    }, 1000);
    
    document.body.appendChild(debugPanel);
}

// ===== Utility Functions =====

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate days between dates
function daysBetween(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1 - date2) / oneDay));
}

// Check if date is in the past
function isDateInPast(date) {
    return date < new Date();
}

// ===== Initialize Features =====
console.log(`
╔══════════════════════════════════════════════════════════╗
║  Cross-Canada Journey Dashboard                          ║
║  Cobourg, ON → Melfort, SK                               ║
║  Version 1.0                                             ║
║  Built with ❤️ for a safe winter journey                ║
╚══════════════════════════════════════════════════════════╝
`);

console.log('💡 Keyboard Shortcuts:');
console.log('   Ctrl/Cmd + P: Print dashboard');
console.log('   Ctrl/Cmd + E: Export trip data');
console.log('   Esc: Close expanded itinerary days');
console.log('\n🚗 Safe travels! You\'ve got this for Mom!');
