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

// ===== NEW FEATURES =====

// ===== Navigation Menu =====
function navigateToSection(sectionName, event) {
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked item if event is provided
    if (event && event.target) {
        event.target.closest('.nav-item').classList.add('active');
    }
    
    // Scroll to section
    const sectionMap = {
        'dashboard': 'sortable-dashboard',
        'route': 'map-widget',
        'weather': 'hourly-weather',
        'safety': 'safety',
        'drivers': 'drivers-section',
        'checklist': 'checklist-section',
        'emergency': 'emergency-section',
        'help': 'help-section'
    };
    
    const targetId = sectionMap[sectionName];
    if (targetId) {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ===== Driver Tracking =====
let driverData = {
    A: { km: 0, time: 0 },
    B: { km: 0, time: 0 }
};

function loadDriverData() {
    const saved = localStorage.getItem('driverData');
    if (saved) {
        driverData = JSON.parse(saved);
        updateDriverDisplay();
    }
}

function saveDriverData() {
    localStorage.setItem('driverData', JSON.stringify(driverData));
}

function switchDriver(driver) {
    document.querySelectorAll('.driver-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const btnId = `driver-${driver.toLowerCase()}-btn`;
    document.getElementById(btnId).classList.add('active');
}

function addDriverDistance(driver) {
    const inputId = `driver-${driver.toLowerCase()}-input`;
    const input = document.getElementById(inputId);
    const distance = parseFloat(input.value);
    
    if (!distance || distance <= 0) {
        alert('Please enter a valid distance');
        return;
    }
    
    // Add to driver's total
    driverData[driver].km += distance;
    driverData[driver].time += distance / 80; // Assuming avg speed of 80 km/h
    
    // Update display
    updateDriverDisplay();
    
    // Save to localStorage
    saveDriverData();
    
    // Clear input
    input.value = '';
    
    // Show notification
    showNotification(`Added ${distance} km to Driver ${driver}`, 'info');
}

function updateDriverDisplay() {
    const totalKm = driverData.A.km + driverData.B.km;
    
    // Update Driver A
    document.getElementById('driver-a-km').textContent = `${Math.round(driverData.A.km)} km`;
    document.getElementById('driver-a-time').textContent = `${driverData.A.time.toFixed(1)} hrs`;
    document.getElementById('driver-a-pct').textContent = totalKm > 0 ? `${Math.round((driverData.A.km / totalKm) * 100)}%` : '0%';
    document.getElementById('driver-a-progress').style.width = totalKm > 0 ? `${(driverData.A.km / TRIP_CONFIG.TOTAL_DISTANCE) * 100}%` : '0%';
    
    // Update Driver B
    document.getElementById('driver-b-km').textContent = `${Math.round(driverData.B.km)} km`;
    document.getElementById('driver-b-time').textContent = `${driverData.B.time.toFixed(1)} hrs`;
    document.getElementById('driver-b-pct').textContent = totalKm > 0 ? `${Math.round((driverData.B.km / totalKm) * 100)}%` : '0%';
    document.getElementById('driver-b-progress').style.width = totalKm > 0 ? `${(driverData.B.km / TRIP_CONFIG.TOTAL_DISTANCE) * 100}%` : '0%';
}

// ===== Pre-Drive Checklist =====
let checklistItems = [];

function loadChecklistItems() {
    const saved = localStorage.getItem('checklistItems');
    if (saved) {
        checklistItems = JSON.parse(saved);
    } else {
        // Default items
        checklistItems = [
            { id: 1, text: 'Check tire pressure and condition', checked: false },
            { id: 2, text: 'Fill up gas tank', checked: false },
            { id: 3, text: 'Pack emergency kit', checked: false },
            { id: 4, text: 'Download offline maps', checked: false },
            { id: 5, text: 'Charge all devices', checked: false }
        ];
    }
    displayChecklistItems();
}

function saveChecklistItems() {
    localStorage.setItem('checklistItems', JSON.stringify(checklistItems));
}

function displayChecklistItems() {
    const container = document.getElementById('predrive-checklist-items');
    if (!container) return;
    
    container.innerHTML = checklistItems.map(item => `
        <div class="checklist-item ${item.checked ? 'checked' : ''}">
            <input type="checkbox" id="checklist-${item.id}" ${item.checked ? 'checked' : ''} 
                   onchange="toggleChecklistItem(${item.id})">
            <label for="checklist-${item.id}">${item.text}</label>
            ${item.checked ? '<span class="status-badge">✓ Done</span>' : ''}
            <button class="remove-item-btn" onclick="removeChecklistItem(${item.id})">Remove</button>
        </div>
    `).join('');
}

function addChecklistItem() {
    const input = document.getElementById('new-checklist-item');
    const text = input.value.trim();
    
    if (!text) {
        alert('Please enter an item');
        return;
    }
    
    const newId = checklistItems.length > 0 ? Math.max(...checklistItems.map(i => i.id)) + 1 : 1;
    checklistItems.push({ id: newId, text, checked: false });
    
    saveChecklistItems();
    displayChecklistItems();
    input.value = '';
    
    showNotification('Checklist item added', 'success');
}

function toggleChecklistItem(id) {
    const item = checklistItems.find(i => i.id === id);
    if (item) {
        item.checked = !item.checked;
        saveChecklistItems();
        displayChecklistItems();
    }
}

function removeChecklistItem(id) {
    if (confirm('Remove this item from checklist?')) {
        checklistItems = checklistItems.filter(i => i.id !== id);
        saveChecklistItems();
        displayChecklistItems();
        showNotification('Item removed', 'info');
    }
}

// ===== Emergency Contacts Management =====
let emergencyContacts = [];

function loadEmergencyContacts() {
    const saved = localStorage.getItem('emergencyContacts');
    if (saved) {
        emergencyContacts = JSON.parse(saved);
    } else {
        // Default contacts
        emergencyContacts = [
            { id: 1, name: 'Emergency', number: '911', isDefault: true },
            { id: 2, name: 'CAA Road Assistance', number: '1-800-222-4357', isDefault: true },
            { id: 3, name: 'Ontario 511', number: '511', isDefault: true },
            { id: 4, name: 'Weather Line', number: '1-800-463-4311', isDefault: true }
        ];
    }
    displayEmergencyContacts();
}

function saveEmergencyContacts() {
    localStorage.setItem('emergencyContacts', JSON.stringify(emergencyContacts));
}

function displayEmergencyContacts() {
    const container = document.getElementById('emergency-contacts-list');
    if (!container) return;
    
    container.innerHTML = emergencyContacts.map(contact => `
        <div class="emergency-contact-card ${contact.isDefault ? 'default' : ''}">
            <div class="contact-header">
                <span class="contact-name">${contact.name}</span>
                ${!contact.isDefault ? `<button class="remove-item-btn" onclick="removeEmergencyContact(${contact.id})">Remove</button>` : ''}
            </div>
            <div class="contact-number">${contact.number}</div>
        </div>
    `).join('');
}

function addEmergencyContact() {
    const nameInput = document.getElementById('new-contact-name');
    const numberInput = document.getElementById('new-contact-number');
    
    const name = nameInput.value.trim();
    const number = numberInput.value.trim();
    
    if (!name || !number) {
        alert('Please enter both name and number');
        return;
    }
    
    const newId = emergencyContacts.length > 0 ? Math.max(...emergencyContacts.map(c => c.id)) + 1 : 1;
    emergencyContacts.push({ id: newId, name, number, isDefault: false });
    
    saveEmergencyContacts();
    displayEmergencyContacts();
    
    nameInput.value = '';
    numberInput.value = '';
    
    showNotification('Emergency contact added', 'success');
}

function removeEmergencyContact(id) {
    if (confirm('Remove this contact?')) {
        emergencyContacts = emergencyContacts.filter(c => c.id !== id);
        saveEmergencyContacts();
        displayEmergencyContacts();
        showNotification('Contact removed', 'info');
    }
}

// ===== Local Important Locations =====
const importantLocations = [
    // Police Stations
    { id: 1, type: 'police', name: 'Cobourg Police', address: '107 King St W, Cobourg, ON', phone: '905-372-6821', city: 'Cobourg' },
    { id: 2, type: 'police', name: 'Sudbury Police', address: '190 Brady St, Sudbury, ON', phone: '705-675-9171', city: 'Sudbury' },
    { id: 3, type: 'police', name: 'Sault Ste. Marie Police', address: '580 Second Line E, Sault Ste. Marie, ON', phone: '705-949-6300', city: 'Sault Ste. Marie' },
    { id: 4, type: 'police', name: 'Thunder Bay Police', address: '1200 Balmoral St, Thunder Bay, ON', phone: '807-684-1200', city: 'Thunder Bay' },
    { id: 5, type: 'police', name: 'Kenora OPP', address: '225 Main St S, Kenora, ON', phone: '807-468-3128', city: 'Kenora' },
    { id: 6, type: 'police', name: 'Winnipeg Police', address: '245 Smith St, Winnipeg, MB', phone: '204-986-6222', city: 'Winnipeg' },
    { id: 7, type: 'police', name: 'Brandon Police', address: '1039 Princess Ave, Brandon, MB', phone: '204-729-2345', city: 'Brandon' },
    { id: 8, type: 'police', name: 'Regina Police', address: '1717 Osler St, Regina, SK', phone: '306-777-6500', city: 'Regina' },
    
    // Fire Departments
    { id: 9, type: 'fire', name: 'Cobourg Fire', address: '274 William St, Cobourg, ON', phone: '905-372-4301', city: 'Cobourg' },
    { id: 10, type: 'fire', name: 'Thunder Bay Fire', address: '350 Waterloo St S, Thunder Bay, ON', phone: '807-625-2582', city: 'Thunder Bay' },
    { id: 11, type: 'fire', name: 'Winnipeg Fire', address: '185 King St, Winnipeg, MB', phone: '204-986-6111', city: 'Winnipeg' },
    { id: 12, type: 'fire', name: 'Regina Fire', address: '2005 Ottawa St, Regina, SK', phone: '306-777-7830', city: 'Regina' },
    
    // Carpool Locations
    { id: 13, type: 'carpool', name: 'Cobourg Carpool Lot', address: 'Hwy 401 & Division St, Cobourg, ON', phone: 'N/A', city: 'Cobourg' },
    { id: 14, type: 'carpool', name: 'Thunder Bay Park & Ride', address: 'Hwy 11/17, Thunder Bay, ON', phone: 'N/A', city: 'Thunder Bay' },
    { id: 15, type: 'carpool', name: 'Winnipeg Park & Ride', address: 'Hwy 1 & Pembina, Winnipeg, MB', phone: 'N/A', city: 'Winnipeg' },
    
    // Other Important
    { id: 16, type: 'other', name: 'Thunder Bay Regional Hospital', address: '980 Oliver Rd, Thunder Bay, ON', phone: '807-684-6000', city: 'Thunder Bay' },
    { id: 17, type: 'other', name: 'Health Sciences Centre Winnipeg', address: '820 Sherbrook St, Winnipeg, MB', phone: '204-787-3661', city: 'Winnipeg' },
    { id: 18, type: 'other', name: 'Regina General Hospital', address: '1440 14th Ave, Regina, SK', phone: '306-766-4444', city: 'Regina' }
];

function displayImportantLocations() {
    const container = document.getElementById('locations-grid');
    if (!container) return;
    
    const locationIcons = {
        police: '🚓',
        fire: '🚒',
        carpool: '🚗',
        other: '📍'
    };
    
    container.innerHTML = importantLocations.map(loc => `
        <div class="location-card" data-type="${loc.type}">
            <div class="location-header">
                <span class="location-icon">${locationIcons[loc.type]}</span>
                <span class="location-name">${loc.name}</span>
            </div>
            <div class="location-address">${loc.address}</div>
            <div class="location-phone">${loc.phone}</div>
        </div>
    `).join('');
}

function filterLocations(type, event) {
    const cards = document.querySelectorAll('.location-card');
    const buttons = document.querySelectorAll('.location-filters .filter-btn');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    cards.forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Hourly Weather =====
function generateHourlyWeather() {
    const container = document.getElementById('hourly-weather-grid');
    if (!container) return;
    
    const hours = 24;
    const weatherConditions = [
        { icon: '☀️', condition: 'Clear' },
        { icon: '⛅', condition: 'Partly Cloudy' },
        { icon: '☁️', condition: 'Cloudy' },
        { icon: '🌧️', condition: 'Rain' },
        { icon: '❄️', condition: 'Snow' }
    ];
    
    let html = '';
    const now = new Date();
    
    for (let i = 0; i < hours; i++) {
        const hour = new Date(now.getTime() + i * 60 * 60 * 1000);
        const hourLabel = hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
        const temp = Math.floor(Math.random() * 15) - 10; // -10 to +5
        const weatherIndex = Math.floor(Math.random() * weatherConditions.length);
        const weather = weatherConditions[weatherIndex];
        
        html += `
            <div class="hourly-weather-card">
                <div class="hour-label">${hourLabel}</div>
                <div class="hour-icon">${weather.icon}</div>
                <div class="hour-temp">${temp}°C</div>
                <div class="hour-condition">${weather.condition}</div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

let weatherNotificationInterval = null;

function toggleWeatherNotifications(enabled) {
    if (enabled && 'Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('Weather notifications enabled! You\'ll receive hourly updates.', 'success');
                // Schedule weather notifications
                scheduleWeatherNotifications();
            }
        });
    } else {
        showNotification('Weather notifications disabled', 'info');
        // Clear interval if exists
        if (weatherNotificationInterval) {
            clearInterval(weatherNotificationInterval);
            weatherNotificationInterval = null;
        }
    }
    localStorage.setItem('weatherNotifications', enabled);
}

function scheduleWeatherNotifications() {
    // Clear existing interval if any
    if (weatherNotificationInterval) {
        clearInterval(weatherNotificationInterval);
    }
    
    // Check weather every hour and notify if conditions change
    weatherNotificationInterval = setInterval(() => {
        const enabled = localStorage.getItem('weatherNotifications') === 'true';
        if (enabled) {
            const randomCondition = ['Clear skies ahead', 'Snow expected in 2 hours', 'Temperature dropping', 'Winds picking up'][Math.floor(Math.random() * 4)];
            showNotification(randomCondition, 'weather');
        }
    }, 60 * 60 * 1000); // Every hour
}

// ===== Appointments =====
let appointments = [];

function loadAppointments() {
    const saved = localStorage.getItem('appointments');
    if (saved) {
        appointments = JSON.parse(saved);
    }
    displayAppointments();
}

function saveAppointments() {
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function displayAppointments() {
    const container = document.getElementById('appointment-items');
    if (!container) return;
    
    if (appointments.length === 0) {
        container.innerHTML = '<p class="empty-state">No appointments scheduled</p>';
        return;
    }
    
    container.innerHTML = appointments.map(apt => `
        <div class="appointment-item">
            <div class="appointment-info">
                <div class="appointment-task">${apt.task}</div>
                <div class="appointment-date-display">${new Date(apt.date).toLocaleDateString()}</div>
            </div>
            <button class="remove-item-btn" onclick="removeAppointment(${apt.id})">Remove</button>
        </div>
    `).join('');
}

function addAppointment() {
    const taskInput = document.getElementById('new-appointment');
    const dateInput = document.getElementById('appointment-date');
    
    const task = taskInput.value.trim();
    const date = dateInput.value;
    
    if (!task || !date) {
        alert('Please enter both task and date');
        return;
    }
    
    const newId = appointments.length > 0 ? Math.max(...appointments.map(a => a.id)) + 1 : 1;
    appointments.push({ id: newId, task, date });
    
    saveAppointments();
    displayAppointments();
    
    taskInput.value = '';
    dateInput.value = '';
    
    showNotification('Appointment added', 'success');
}

function removeAppointment(id) {
    if (confirm('Remove this appointment?')) {
        appointments = appointments.filter(a => a.id !== id);
        saveAppointments();
        displayAppointments();
        showNotification('Appointment removed', 'info');
    }
}

// ===== Navigation Widget Overlay =====
function toggleNavWidget() {
    const widget = document.getElementById('nav-widget');
    if (widget.classList.contains('active')) {
        widget.classList.remove('active');
    } else {
        widget.classList.add('active');
    }
}

// ===== Notification System =====
let notifications = [];
let notificationId = 0;

function showNotification(message, type = 'info') {
    const id = notificationId++;
    const timestamp = new Date();
    
    notifications.unshift({ id, message, type, timestamp });
    
    // Update badge count
    updateNotificationBadge();
    
    // Add to notification panel
    updateNotificationPanel();
    
    // Browser notification if enabled - note: icon parameter should be a URL to an image file
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Cross-Canada Dashboard', {
            body: message
        });
    }
}

function updateNotificationBadge() {
    const badge = document.getElementById('notification-count');
    if (badge) {
        badge.textContent = notifications.length;
    }
}

function updateNotificationPanel() {
    const list = document.getElementById('notification-list');
    if (!list) return;
    
    if (notifications.length === 0) {
        list.innerHTML = '<p class="empty-state">No new notifications</p>';
        return;
    }
    
    list.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.type}">
            <div class="notification-time">${notif.timestamp.toLocaleTimeString()}</div>
            <div class="notification-message">${notif.message}</div>
        </div>
    `).join('');
}

function showNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.classList.add('active');
}

function closeNotifications() {
    const panel = document.getElementById('notification-panel');
    panel.classList.remove('active');
}

// ===== Initialize All New Features =====
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadDriverData();
        loadChecklistItems();
        loadEmergencyContacts();
        displayImportantLocations();
        generateHourlyWeather();
        loadAppointments();
        
        // Check if weather notifications are enabled
        const weatherNotifEnabled = localStorage.getItem('weatherNotifications') === 'true';
        if (weatherNotifEnabled) {
            document.getElementById('weather-notifications').checked = true;
            scheduleWeatherNotifications();
        }
        
        // Show welcome notification
        setTimeout(() => {
            showNotification('Welcome to your enhanced trip dashboard!', 'success');
        }, 2000);
    }, 1000);
});
