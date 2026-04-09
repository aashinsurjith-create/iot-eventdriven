// ============================================
// IoT Dashboard - Frontend JavaScript
// ============================================

// Configuration
const API_BASE_URL = 'http://localhost:3000/api';
const REFRESH_INTERVAL = 2000; // 2 seconds
let refreshTimer = null;

// Chart instances
let temperatureChart = null;
let humidityChart = null;
let batteryChart = null;
let thresholdChart = null;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    initializeCharts();
    fetchAndUpdateData();
    startAutoRefresh();
});

// ============================================
// AUTO-REFRESH FUNCTIONALITY
// ============================================

function startAutoRefresh() {
    // Initial fetch
    fetchAndUpdateData();

    // Set up interval for auto-refresh every 2 seconds
    refreshTimer = setInterval(() => {
        fetchAndUpdateData();
    }, REFRESH_INTERVAL);

    console.log('Auto-refresh started (every 2 seconds)');
}

function stopAutoRefresh() {
    if (refreshTimer) {
        clearInterval(refreshTimer);
        refreshTimer = null;
    }
}

// ============================================
// DATA FETCHING
// ============================================

async function fetchAndUpdateData() {
    try {
        // Fetch latest data
        const latestResponse = await fetch(`${API_BASE_URL}/latest`);
        const latestData = await latestResponse.json();

        if (latestData.success) {
            updateLiveCards(latestData.data);
        } else {
            console.warn('No data available yet');
        }

        // Fetch history for charts
        const historyResponse = await fetch(`${API_BASE_URL}/history`);
        const historyData = await historyResponse.json();

        if (historyData.success && historyData.data.length > 0) {
            updateCharts(historyData.data);
            updateTable(historyData.data);
        }

        // Fetch statistics
        const statsResponse = await fetch(`${API_BASE_URL}/stats`);
        const statsData = await statsResponse.json();

        if (statsData.success) {
            updateStatistics(statsData.data);
        }

        // Fetch AI analysis
        const aiResponse = await fetch(`${API_BASE_URL}/ai-analysis`);
        const aiData = await aiResponse.json();

        if (aiData.success) {
            updateAIAnalysis(aiData.data);
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// ============================================
// UPDATE LIVE CARDS
// ============================================

function updateLiveCards(data) {
    // Temperature
    const temp = parseFloat(data.temperature);
    document.getElementById('temp-value').textContent = temp.toFixed(1);
    document.getElementById('temp-time').textContent = `Last: ${formatTime(data.created_at)}`;

    // Humidity
    const humidity = parseFloat(data.humidity);
    document.getElementById('humidity-value').textContent = humidity.toFixed(1);
    document.getElementById('humidity-time').textContent = `Last: ${formatTime(data.created_at)}`;

    // Threshold
    const threshold = parseFloat(data.threshold_value);
    document.getElementById('threshold-value').textContent = threshold.toFixed(1);
    document.getElementById('threshold-time').textContent = `Last: ${formatTime(data.created_at)}`;

    // Battery Percentage
    const battery = parseFloat(data.battery_percentage);
    document.getElementById('battery-value').textContent = battery.toFixed(0);
    document.getElementById('battery-time').textContent = `Last: ${formatTime(data.created_at)}`;

    // Battery Status
    const batteryStatusElement = document.getElementById('battery-status');
    batteryStatusElement.textContent = data.battery_status;
    batteryStatusElement.className = `status-badge ${data.battery_status.toLowerCase()}`;
    document.getElementById('battery-status-time').textContent = `Last: ${formatTime(data.created_at)}`;

    // Event Status
    const eventStatusElement = document.getElementById('event-status');
    eventStatusElement.textContent = data.event_status;
    eventStatusElement.className = `status-badge ${data.event_status === 'EVENT DETECTED' ? 'event' : 'normal'}`;
    document.getElementById('event-status-time').textContent = `Last: ${formatTime(data.created_at)}`;
}

// ============================================
// CHART INITIALIZATION AND UPDATE
// ============================================

function initializeCharts() {
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#a0a0a0',
                    font: { size: 12 }
                }
            }
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#a0a0a0' }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#a0a0a0' }
            }
        }
    };

    // Temperature Chart
    const tempCtx = document.getElementById('temperatureChart').getContext('2d');
    temperatureChart = new Chart(tempCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Temperature (°C)',
                data: [],
                borderColor: '#ff8c00',
                backgroundColor: 'rgba(255, 140, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#ff8c00'
            }]
        },
        options: chartOptions
    });

    // Humidity Chart
    const humidityCtx = document.getElementById('humidityChart').getContext('2d');
    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Humidity (%)',
                data: [],
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#00d4ff'
            }]
        },
        options: chartOptions
    });

    // Battery Chart
    const batteryCtx = document.getElementById('batteryChart').getContext('2d');
    batteryChart = new Chart(batteryCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Battery (%)',
                data: [],
                borderColor: '#ffaa00',
                backgroundColor: 'rgba(255, 170, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#ffaa00'
            }]
        },
        options: chartOptions
    });

    // Threshold Chart
    const thresholdCtx = document.getElementById('thresholdChart').getContext('2d');
    thresholdChart = new Chart(thresholdCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Threshold (°C)',
                data: [],
                borderColor: '#00ff88',
                backgroundColor: 'rgba(0, 255, 136, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#00ff88'
            }]
        },
        options: chartOptions
    });
}

function updateCharts(data) {
    // Prepare data - convert strings to numbers
    const labels = data.map(d => formatTime(d.created_at));
    const temperatures = data.map(d => parseFloat(d.temperature));
    const humidities = data.map(d => parseFloat(d.humidity));
    const batteries = data.map(d => parseFloat(d.battery_percentage));
    const thresholds = data.map(d => parseFloat(d.threshold_value));

    // Update Temperature Chart
    temperatureChart.data.labels = labels;
    temperatureChart.data.datasets[0].data = temperatures;
    temperatureChart.update('none');

    // Update Humidity Chart
    humidityChart.data.labels = labels;
    humidityChart.data.datasets[0].data = humidities;
    humidityChart.update('none');

    // Update Battery Chart
    batteryChart.data.labels = labels;
    batteryChart.data.datasets[0].data = batteries;
    batteryChart.update('none');

    // Update Threshold Chart
    thresholdChart.data.labels = labels;
    thresholdChart.data.datasets[0].data = thresholds;
    thresholdChart.update('none');
}

// ============================================
// UPDATE TABLE
// ============================================

function updateTable(data) {
    const tbody = document.getElementById('readings-tbody');
    
    // Show only last 20 readings
    const displayData = data.slice(-20).reverse();

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No data available</td></tr>';
        return;
    }

    tbody.innerHTML = displayData.map(reading => `
        <tr>
            <td>${formatDateTime(reading.created_at)}</td>
            <td>${parseFloat(reading.temperature).toFixed(1)}</td>
            <td>${parseFloat(reading.humidity).toFixed(1)}</td>
            <td>${parseFloat(reading.threshold_value).toFixed(1)}</td>
            <td>${parseFloat(reading.battery_percentage).toFixed(0)}</td>
            <td><span class="status-badge ${reading.battery_status.toLowerCase()}">${reading.battery_status}</span></td>
            <td><span class="status-badge ${reading.event_status === 'EVENT DETECTED' ? 'event' : 'normal'}">${reading.event_status}</span></td>
        </tr>
    `).join('');
}

// ============================================
// UPDATE STATISTICS
// ============================================

function updateStatistics(stats) {
    document.getElementById('stat-total').textContent = stats.total_readings || 0;
    const avgTemp = parseFloat(stats.avg_temperature);
    const avgHumidity = parseFloat(stats.avg_humidity);
    document.getElementById('stat-avg-temp').textContent = !isNaN(avgTemp) ? avgTemp.toFixed(1) + '°C' : '--°C';
    document.getElementById('stat-avg-humidity').textContent = !isNaN(avgHumidity) ? avgHumidity.toFixed(1) + '%' : '--%';
    document.getElementById('stat-events').textContent = stats.event_count || 0;
}

// ============================================
// UPDATE AI ANALYSIS
// ============================================

function updateAIAnalysis(analysis) {
    document.getElementById('ai-ac').textContent = analysis.ac_recommendation || 'Analyzing...';
    document.getElementById('ai-env').textContent = analysis.environmental_impact || 'Analyzing...';
    document.getElementById('ai-health').textContent = analysis.health_impact || 'Analyzing...';
    
    const statusElement = document.getElementById('ai-status');
    const status = (analysis.status || 'ANALYZING').toUpperCase();
    statusElement.textContent = status;
    
    // Update status badge color
    statusElement.className = 'ai-status-badge';
    if (status.includes('SAFE') || status.includes('NORMAL')) {
        statusElement.classList.add('safe');
    } else if (status.includes('WARNING')) {
        statusElement.classList.add('warning');
    } else if (status.includes('DANGER')) {
        statusElement.classList.add('danger');
    }
}

// ============================================
// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// ============================================
// PAGE VISIBILITY HANDLING
// ============================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoRefresh();
        console.log('Page hidden - auto-refresh stopped');
    } else {
        startAutoRefresh();
        console.log('Page visible - auto-refresh resumed');
    }
});

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', () => {
    stopAutoRefresh();
});

console.log('Dashboard script loaded successfully');
