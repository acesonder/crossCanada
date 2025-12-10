// ===== Cross-Canada Travel Dashboard JavaScript =====

// Constants
const TRIP_CONFIG = {
    TARGET_DATE: new Date('2024-12-18T00:00:00'),
    TOTAL_DISTANCE: 3000, // km
    FUEL_EFFICIENCY_WINTER: 25, // MPG
    PRICE_PER_LITER: 1.70, // CAD
    LITERS_PER_GALLON: 3.785
};

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
    const targetDate = TRIP_CONFIG.TARGET_DATE;
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
    const targetDate = TRIP_CONFIG.TARGET_DATE;
    
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
    const totalDistance = TRIP_CONFIG.TOTAL_DISTANCE;
    
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
    const fuelEfficiency = TRIP_CONFIG.FUEL_EFFICIENCY_WINTER;
    const pricePerLiter = TRIP_CONFIG.PRICE_PER_LITER;
    const litersPerGallon = TRIP_CONFIG.LITERS_PER_GALLON;
    
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

// ===== NEW FEATURES =====

// Theme Management
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    const icon = document.querySelector('.theme-icon');
    if (icon) {
        icon.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    }
}

function changeTheme(theme) {
    const body = document.body;
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        theme = prefersDark ? 'dark' : 'light';
    }
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.getElementById('theme-select').value = theme;
}

// Settings Modal
function openSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.add('active');
    
    // Load current settings
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedUnits = localStorage.getItem('units') || 'metric';
    document.getElementById('theme-select').value = savedTheme;
    document.getElementById('units-select').value = savedUnits;
}

function closeSettings() {
    const modal = document.getElementById('settings-modal');
    modal.classList.remove('active');
}

function changeUnits(units) {
    localStorage.setItem('units', units);
    // Refresh data displays with new units
    console.log(`Units changed to: ${units}`);
}

function toggleNotifications(enabled) {
    if (enabled && 'Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('🚗 Cross-Canada Dashboard', {
                    body: 'Notifications enabled! You\'ll receive weather and milestone alerts.',
                    icon: '🚗'
                });
            }
        });
    }
    localStorage.setItem('notifications', enabled);
}

function resetDashboard() {
    if (confirm('Are you sure you want to reset all dashboard data?')) {
        localStorage.clear();
        location.reload();
    }
}

// Share Trip
function shareTrip() {
    const tripData = {
        route: 'Cobourg, ON → Melfort, SK',
        distance: TRIP_CONFIG.TOTAL_DISTANCE,
        progress: document.getElementById('distance-covered')?.value || 0
    };
    
    const shareUrl = window.location.href;
    const shareText = `🚗 Following my ${tripData.distance}km winter journey from ${tripData.route}! Currently at ${tripData.progress}km. Wish me safe travels!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Cross-Canada Journey',
            text: shareText,
            url: shareUrl
        }).catch(err => console.log('Share cancelled'));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(`${shareText}\n${shareUrl}`).then(() => {
            alert('Trip link copied to clipboard!');
        });
    }
}

// Interactive Map with Leaflet
let map;
let routeLayer;

function initializeMap() {
    if (!document.getElementById('route-map')) return;
    
    // Initialize map centered on route
    map = L.map('route-map').setView([48.5, -85.0], 5);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Route waypoints
    const waypoints = [
        { name: 'Cobourg, ON', lat: 43.9593, lng: -78.1675, icon: '🏁' },
        { name: 'Sault Ste. Marie', lat: 46.5212, lng: -84.3467, icon: '⛽' },
        { name: 'Thunder Bay', lat: 48.3809, lng: -89.2477, icon: '🏨' },
        { name: 'Winnipeg', lat: 49.8951, lng: -97.1384, icon: '🍽️' },
        { name: 'Regina', lat: 50.4452, lng: -104.6189, icon: '⛽' },
        { name: 'Melfort, SK', lat: 52.8565, lng: -104.6106, icon: '🎂' }
    ];
    
    // Add markers
    waypoints.forEach(point => {
        const marker = L.marker([point.lat, point.lng]).addTo(map);
        marker.bindPopup(`<b>${point.icon} ${point.name}</b>`);
    });
    
    // Draw route line
    const routeCoords = waypoints.map(p => [p.lat, p.lng]);
    routeLayer = L.polyline(routeCoords, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.7
    }).addTo(map);
    
    // Fit bounds to route
    map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });
}

function showAlternativeRoutes() {
    alert('Alternative routes feature coming soon! Currently showing the recommended Trans-Canada Highway route.');
}

function addWaypoint() {
    const location = prompt('Enter waypoint location (e.g., "Kenora, ON"):');
    if (location) {
        alert(`Waypoint "${location}" will be added in a future update!`);
    }
}

function calculateETA() {
    const distanceCovered = parseInt(document.getElementById('distance-covered')?.value) || 0;
    const remaining = TRIP_CONFIG.TOTAL_DISTANCE - distanceCovered;
    const avgSpeed = 80; // km/h
    const hoursRemaining = remaining / avgSpeed;
    const daysRemaining = Math.ceil(hoursRemaining / 8); // 8 hours driving per day
    
    const etaDisplay = document.getElementById('eta-display');
    const etaTime = document.getElementById('eta-time');
    const etaDelays = document.getElementById('eta-delays');
    
    if (etaDisplay && etaTime) {
        etaDisplay.style.display = 'block';
        const arrivalDate = new Date();
        arrivalDate.setDate(arrivalDate.getDate() + daysRemaining);
        etaTime.textContent = arrivalDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        etaDelays.textContent = 'Weather delays not included';
    }
}

// Live Weather Integration
async function fetchLiveWeather() {
    // Using OpenWeatherMap API (demo with simulated data)
    const cities = [
        { name: 'Cobourg', lat: 43.9593, lon: -78.1675 },
        { name: 'Sault Ste. Marie', lat: 46.5212, lon: -84.3467 },
        { name: 'Thunder Bay', lat: 48.3809, lon: -89.2477 },
        { name: 'Winnipeg', lat: 49.8951, lon: -97.1384 },
        { name: 'Regina', lat: 50.4452, lon: -104.6189 },
        { name: 'Melfort', lat: 52.8565, lon: -104.6106 }
    ];
    
    const weatherGrid = document.getElementById('live-weather-grid');
    if (!weatherGrid) return;
    
    // Simulated weather data (replace with actual API calls)
    const simulatedWeather = cities.map(city => ({
        name: city.name,
        temp: Math.floor(Math.random() * 20) - 15,
        condition: ['❄️ Snow', '🌧️ Rain', '☁️ Cloudy', '🌤️ Partly Cloudy'][Math.floor(Math.random() * 4)],
        wind: Math.floor(Math.random() * 30) + 10
    }));
    
    weatherGrid.innerHTML = simulatedWeather.map(w => `
        <div class="live-weather-card">
            <h4>${w.name}</h4>
            <div class="weather-icon-large">${w.condition.split(' ')[0]}</div>
            <p class="temp">${w.temp}°C</p>
            <p>${w.condition.split(' ').slice(1).join(' ')}</p>
            <p style="font-size: 0.875rem; color: var(--text-secondary);">Wind: ${w.wind} km/h</p>
        </div>
    `).join('');
    
    // Check for alerts
    checkWeatherAlerts();
}

function checkWeatherAlerts() {
    const alertsDiv = document.getElementById('weather-alerts');
    if (!alertsDiv) return;
    
    // Simulated alerts
    const alerts = [
        { type: 'warning', message: '⚠️ Winter storm warning for Northern Ontario - Dec 10-12' },
        { type: 'alert', message: '❄️ Heavy snow expected in Manitoba prairies - Dec 12-13' }
    ];
    
    if (alerts.length > 0) {
        alertsDiv.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.type}">
                ${alert.message}
            </div>
        `).join('');
    } else {
        alertsDiv.innerHTML = '<p style="color: var(--success-color);">✓ No weather alerts at this time</p>';
    }
}

// Achievements System
function updateAchievements() {
    const progress = parseInt(document.getElementById('distance-covered')?.value) || 0;
    const percentage = (progress / TRIP_CONFIG.TOTAL_DISTANCE) * 100;
    
    const milestones = [
        { id: 'achievement-25', threshold: 25 },
        { id: 'achievement-50', threshold: 50 },
        { id: 'achievement-75', threshold: 75 },
        { id: 'achievement-100', threshold: 100 }
    ];
    
    milestones.forEach(milestone => {
        const elem = document.getElementById(milestone.id);
        if (elem) {
            const progressBar = elem.querySelector('.progress-bar-mini');
            if (progressBar) {
                progressBar.style.width = Math.min(percentage / milestone.threshold * 100, 100) + '%';
            }
            
            if (percentage >= milestone.threshold) {
                elem.classList.remove('locked');
                elem.classList.add('unlocked');
            }
        }
    });
}

// Trivia System
const triviaQuestions = [
    { q: 'What is the capital of Saskatchewan?', a: 'Regina' },
    { q: 'Which Great Lake does Thunder Bay sit on?', a: 'Lake Superior' },
    { q: 'What is Manitoba known as?', a: 'The Prairie Province' },
    { q: 'What year was the Trans-Canada Highway completed?', a: '1962' },
    { q: 'What is Ontario\'s provincial flower?', a: 'White Trillium' }
];

let currentTriviaIndex = 0;

function showTriviaAnswer() {
    const answerElem = document.getElementById('trivia-answer');
    if (answerElem) {
        answerElem.style.display = 'block';
    }
}

function nextTrivia() {
    currentTriviaIndex = (currentTriviaIndex + 1) % triviaQuestions.length;
    const question = triviaQuestions[currentTriviaIndex];
    
    const qElem = document.getElementById('trivia-q');
    const aElem = document.getElementById('trivia-a');
    const answerElem = document.getElementById('trivia-answer');
    
    if (qElem && aElem && answerElem) {
        qElem.textContent = question.q;
        aElem.textContent = question.a;
        answerElem.style.display = 'none';
    }
}

// Cost Analysis
let expenses = [];
let costChart = null;

function initCostChart() {
    const canvas = document.getElementById('cost-breakdown-chart');
    if (!canvas || !window.Chart) return;
    
    const ctx = canvas.getContext('2d');
    costChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Fuel', 'Accommodation', 'Food', 'Other'],
            datasets: [{
                data: [475, 745, 250, 125],
                backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e2e8f0'
                    }
                }
            }
        }
    });
}

function addExpense() {
    const desc = document.getElementById('expense-desc').value;
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    
    if (!desc || !amount) {
        alert('Please fill in all fields');
        return;
    }
    
    expenses.push({ desc, amount, category, date: new Date() });
    
    // Update display
    updateExpenseList();
    updateCostStats();
    
    // Clear form
    document.getElementById('expense-desc').value = '';
    document.getElementById('expense-amount').value = '';
    
    // Save to localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateExpenseList() {
    const list = document.getElementById('expense-list');
    if (!list) return;
    
    list.innerHTML = expenses.map((exp, idx) => `
        <div class="expense-item">
            <span>${exp.desc} (${exp.category})</span>
            <span>$${exp.amount.toFixed(2)}</span>
            <button class="btn-secondary" onclick="removeExpense(${idx})" style="padding: 0.25rem 0.5rem;">Remove</button>
        </div>
    `).join('');
}

function removeExpense(index) {
    expenses.splice(index, 1);
    updateExpenseList();
    updateCostStats();
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

function updateCostStats() {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const projected = 1600;
    
    const actualElem = document.getElementById('actual-cost');
    const remainingElem = document.getElementById('remaining-budget');
    
    if (actualElem) actualElem.textContent = total.toFixed(2);
    if (remainingElem) remainingElem.textContent = (projected - total).toFixed(2);
}

// Amenities & Favorites
let favorites = [];

function filterAmenities(type) {
    const cards = document.querySelectorAll('.amenity-card');
    const buttons = document.querySelectorAll('.filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function addToFavorites(id) {
    if (!favorites.includes(id)) {
        favorites.push(id);
        updateFavoritesList();
        localStorage.setItem('favorites', JSON.stringify(favorites));
        
        // Visual feedback
        event.target.textContent = '⭐ Favorited!';
        setTimeout(() => {
            event.target.textContent = '⭐ Favorite';
        }, 2000);
    }
}

function updateFavoritesList() {
    const list = document.getElementById('favorites-list');
    if (!list) return;
    
    if (favorites.length === 0) {
        list.innerHTML = '<p class="empty-state">No favorites yet. Click the star to add stops!</p>';
    } else {
        list.innerHTML = favorites.map(fav => `
            <div class="favorite-item">
                <span>⭐ ${fav}</span>
            </div>
        `).join('');
    }
}

// Load saved data on init
function loadEnhancedData() {
    // Load theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Load expenses
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
        updateExpenseList();
        updateCostStats();
    }
    
    // Load favorites
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
        updateFavoritesList();
    }
}

// Initialize all enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeMap();
        fetchLiveWeather();
        initCostChart();
        loadEnhancedData();
        
        // Refresh weather every 30 minutes
        setInterval(fetchLiveWeather, 30 * 60 * 1000);
        
        // Enable drag & drop for dashboard widgets
        if (window.Sortable) {
            const dashboard = document.getElementById('sortable-dashboard');
            if (dashboard) {
                new Sortable(dashboard, {
                    animation: 150,
                    handle: '.widget-header',
                    ghostClass: 'sortable-ghost'
                });
            }
        }
    }, 500);
});

// Update achievements when progress changes
const originalUpdateProgress = updateProgress;
updateProgress = function() {
    originalUpdateProgress();
    updateAchievements();
};
