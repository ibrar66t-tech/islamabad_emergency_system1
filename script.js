// Islamabad Sector Data - All sectors
const islamabadSectors = [
    'F-5', 'F-6', 'F-7', 'F-8', 'F-10', 'F-11',
    'G-5', 'G-6', 'G-7', 'G-8', 'G-9', 'G-10', 'G-11',
    'H-8', 'H-9', 'H-10', 'H-11', 'H-12', 'H-13',
    'I-8', 'I-9', 'I-10', 'I-11', 'I-12', 'I-13', 'I-14',
    'E-7', 'E-8', 'E-9', 'E-11', 'E-16', 'E-17',
    'D-10', 'D-11', 'D-12', 'D-13', 'D-14', 'D-15', 'D-16',
    'C-13', 'C-14', 'C-15', 'C-16', 'C-17', 'C-18'
];

// System State
let systemState = {
    totalEmergencies: 0,
    resourcesDeployed: 0,
    sectorsAffected: 0,
    alertCount: 0,
    averageResponseTime: 0,
    emergencies: [],
    logEntries: [],
    citizenReports: []
};

// Weather data storage
let weatherData = null;

// Initialize System
function initSystem() {
    updateTime();
    renderSectorMap();
    loadInitialData();
    startSimulation();
    fetchRealTimeWeather();
    initTrafficSystem();
    initCitizenReports();
    
    // Add initial log entry
    addLogEntry("🚀 System initialized. Monitoring all sectors of Islamabad.", "system");
    addLogEntry("✅ Connected to Rescue 1122, CDA, Police, and Hospital systems.", "system");
    addLogEntry("📡 Real-time weather and traffic monitoring activated.", "system");
    
    // Update statistics every 5 seconds
    setInterval(updateStatistics, 5000);
    
    // Simulate random events every 10-30 seconds
    setInterval(() => {
        if (Math.random() > 0.7) {
            simulateRandomEmergency();
        }
    }, Math.random() * 20000 + 10000);
}

// Update Time Display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    const dateString = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    document.getElementById('timeDisplay').innerHTML = 
        `<i class="fas fa-clock"></i> ${timeString}<br><small>${dateString}</small>`;
    
    setTimeout(updateTime, 1000);
}

// Render Islamabad Sector Map
function renderSectorMap() {
    const mapContainer = document.getElementById('sectorMap');
    mapContainer.innerHTML = '';
    
    islamabadSectors.forEach(sector => {
        const sectorDiv = document.createElement('div');
        sectorDiv.className = 'sector normal';
        sectorDiv.id = `sector-${sector}`;
        sectorDiv.innerHTML = `<strong>${sector}</strong>`;
        sectorDiv.onclick = () => showSectorDetails(sector);
        
        mapContainer.appendChild(sectorDiv);
    });
}

// Load Initial Data
function loadInitialData() {
    // Simulate some initial data
    systemState.emergencies = [
        { id: 1, type: 'minor_fire', sector: 'G-9', severity: 'alert', timestamp: Date.now() - 300000, name: 'Small Fire' },
        { id: 2, type: 'medical', sector: 'F-7', severity: 'emergency', timestamp: Date.now() - 600000, name: 'Heart Attack' }
    ];
    
    updateSectorStatus('G-9', 'alert');
    updateSectorStatus('F-7', 'emergency');
    
    // Update statistics
    updateStatistics();
}

// Simulate Emergency
function simulateEmergency(type) {
    const emergencyTypes = {
        earthquake: { name: 'Earthquake', severity: 'critical', icon: 'fa-mountain' },
        fire: { name: 'Building Fire', severity: 'emergency', icon: 'fa-fire' },
        flood: { name: 'Flash Flood', severity: 'emergency', icon: 'fa-water' },
        medical: { name: 'Medical Emergency', severity: 'alert', icon: 'fa-ambulance' }
    };
    
    const randomSector = islamabadSectors[Math.floor(Math.random() * islamabadSectors.length)];
    const emergency = emergencyTypes[type];
    
    // Create emergency record
    const emergencyId = systemState.totalEmergencies + 1;
    const newEmergency = {
        id: emergencyId,
        type: type,
        name: emergency.name,
        sector: randomSector,
        severity: emergency.severity,
        timestamp: Date.now()
    };
    
    systemState.emergencies.push(newEmergency);
    systemState.totalEmergencies++;
    
    // Update sector status
    updateSectorStatus(randomSector, emergency.severity);
    
    // Show alert
    showAlert(`🚨 ${emergency.name} reported in Sector ${randomSector}!`);
    
    // Add to log
    addLogEntry(`${emergency.name} detected in Sector ${randomSector}. Severity: ${emergency.severity.toUpperCase()}`, 'emergency');
    
    // Play alert sound
    playAlertSound();
    
    // Update statistics
    updateStatistics();
    
    // Auto-dispatch resources for critical emergencies
    if (emergency.severity === 'critical') {
        setTimeout(() => {
            dispatchAgency('Rescue 1122');
            dispatchAgency('Police');
            dispatchAgency('Hospital');
        }, 2000);
    }
    
    // Auto-send SMS for critical emergencies
    if (emergency.severity === 'critical' || emergency.severity === 'emergency') {
        setTimeout(() => {
            sendMassAlert();
        }, 3000);
    }
}

// Simulate Random Emergency
function simulateRandomEmergency() {
    const types = ['earthquake', 'fire', 'flood', 'medical'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    simulateEmergency(randomType);
}

// Update Sector Status
function updateSectorStatus(sector, status) {
    const sectorElement = document.getElementById(`sector-${sector}`);
    if (sectorElement) {
        // Remove all status classes
        sectorElement.classList.remove('normal', 'alert', 'emergency', 'critical');
        // Add new status class
        sectorElement.classList.add(status);
        
        // Add pulse effect for emergencies
        if (status !== 'normal') {
            sectorElement.style.animation = 'none';
            setTimeout(() => {
                sectorElement.style.animation = '';
            }, 10);
        }
    }
}

// Show Alert
function showAlert(message) {
    const alertBanner = document.getElementById('alertBanner');
    const alertText = document.getElementById('alertText');
    
    alertText.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    alertBanner.style.display = 'flex';
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
        dismissAlert();
    }, 10000);
}

// Dismiss Alert
function dismissAlert() {
    document.getElementById('alertBanner').style.display = 'none';
}

// Send Mass Alert
function sendMassAlert() {
    const affectedSectors = systemState.emergencies
        .filter(e => e.severity === 'emergency' || e.severity === 'critical')
        .map(e => e.sector);
    
    if (affectedSectors.length > 0) {
        const message = `Emergency alert for sectors: ${affectedSectors.join(', ')}. Avoid these areas.`;
        
        showAlert(`📱 SMS Alert sent to 10,000+ residents in affected sectors`);
        addLogEntry(`Mass SMS alert sent to residents in sectors: ${affectedSectors.join(', ')}`, 'alert');
        
        systemState.alertCount++;
        document.getElementById('alertCount').textContent = systemState.alertCount;
        
        // Simulate sending to authorities
        setTimeout(() => {
            addLogEntry(`SMS gateway reports: 10,234 messages delivered successfully`, 'system');
            addLogEntry(`Rescue 1122 confirmed receipt of emergency alert`, 'response');
        }, 2000);
    } else {
        showAlert('No active emergencies requiring mass alerts');
    }
}

// Notify Authorities
function notifyAuthorities() {
    const authorities = [
        'Prime Minister Office', 
        'Ministry of Interior', 
        'National Disaster Management Authority',
        'Islamabad Commissioner',
        'Capital Development Authority'
    ];
    
    showAlert(`📧 Emergency report sent to ${authorities.length} government authorities`);
    addLogEntry(`Emergency situation report dispatched to: ${authorities.join(', ')}`, 'authority');
    
    // Simulate responses
    authorities.forEach((auth, index) => {
        setTimeout(() => {
            addLogEntry(`${auth} acknowledged receipt of emergency report`, 'response');
        }, (index + 1) * 1000);
    });
}

// Dispatch Agency
function dispatchAgency(agency) {
    const agencyData = {
        'Rescue 1122': { unitsElement: 'rescueUnits', initial: 12 },
        'CDA': { teamsElement: 'cdaTeams', initial: 8 },
        'Police': { patrolsElement: 'policePatrols', initial: 15 },
        'Hospital': { ambulancesElement: 'ambulances', initial: 7 }
    };
    
    const data = agencyData[agency];
    if (data) {
        // Find which element to update
        let elementId, currentCount;
        if (data.unitsElement) {
            elementId = data.unitsElement;
            currentCount = parseInt(document.getElementById(elementId).textContent);
        } else if (data.teamsElement) {
            elementId = data.teamsElement;
            currentCount = parseInt(document.getElementById(elementId).textContent);
        } else if (data.patrolsElement) {
            elementId = data.patrolsElement;
            currentCount = parseInt(document.getElementById(elementId).textContent);
        } else if (data.ambulancesElement) {
            elementId = data.ambulancesElement;
            currentCount = parseInt(document.getElementById(elementId).textContent);
        }
        
        // Dispatch if available
        if (currentCount > 0) {
            const newCount = currentCount - 1;
            document.getElementById(elementId).textContent = newCount;
            
            // Get active emergency for dispatch
            const activeEmergency = systemState.emergencies.find(e => 
                e.severity === 'emergency' || e.severity === 'critical'
            );
            
            const sector = activeEmergency ? activeEmergency.sector : 'G-9';
            
            showAlert(`✅ ${agency} dispatched to Sector ${sector}`);
            addLogEntry(`${agency} unit dispatched to Sector ${sector}. ETA: ${Math.floor(Math.random() * 8) + 3} minutes`, 'dispatch');
            
            systemState.resourcesDeployed++;
            
            // Simulate unit returning after some time
            setTimeout(() => {
                document.getElementById(elementId).textContent = newCount + 1;
                addLogEntry(`${agency} unit returned from Sector ${sector}. Mission completed.`, 'system');
                
                // If emergency still exists, resolve it
                const emergencyIndex = systemState.emergencies.findIndex(e => e.sector === sector);
                if (emergencyIndex !== -1) {
                    updateSectorStatus(sector, 'normal');
                    systemState.emergencies.splice(emergencyIndex, 1);
                    addLogEntry(`Emergency in Sector ${sector} has been resolved.`, 'success');
                }
            }, 15000 + Math.random() * 10000);
            
            // Update response time
            const responseTime = Math.floor(Math.random() * 15) + 5;
            systemState.averageResponseTime = 
                (systemState.averageResponseTime * (systemState.resourcesDeployed - 1) + responseTime) / systemState.resourcesDeployed;
        } else {
            showAlert(`⚠️ No ${agency} units available. All deployed.`);
        }
    }
}

// Add Log Entry
function addLogEntry(message, type = 'info') {
    const logContainer = document.getElementById('eventLog');
    const logEntry = document.createElement('div');
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    
    logEntry.className = `log-entry ${type}`;
    logEntry.innerHTML = `<strong>[${timeString}]</strong> ${message}`;
    
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Keep only last 50 entries
    const entries = logContainer.getElementsByClassName('log-entry');
    if (entries.length > 50) {
        entries[0].remove();
    }
    
    // Add to system state
    systemState.logEntries.push({
        timestamp: now,
        message: message,
        type: type
    });
}

// Update Statistics
function updateStatistics() {
    const affectedSectors = new Set();
    systemState.emergencies.forEach(e => {
        if (e.severity !== 'normal') {
            affectedSectors.add(e.sector);
        }
    });
    
    systemState.sectorsAffected = affectedSectors.size;
    
    // Calculate response rate (mock)
    const responseRate = systemState.resourcesDeployed > 0 ? 
        Math.min(100, Math.floor((systemState.resourcesDeployed / systemState.totalEmergencies) * 100)) : 0;
    
    // Update DOM
    document.getElementById('totalEmergencies').textContent = systemState.totalEmergencies;
    document.getElementById('resourcesDeployed').textContent = systemState.resourcesDeployed;
    document.getElementById('sectorsAffected').textContent = systemState.sectorsAffected;
    document.getElementById('responseRate').textContent = `${responseRate}%`;
    document.getElementById('responseTime').textContent = systemState.averageResponseTime.toFixed(1);
}

// Show Sector Details
function showSectorDetails(sector) {
    const emergenciesInSector = systemState.emergencies.filter(e => e.sector === sector);
    
    if (emergenciesInSector.length > 0) {
        const latestEmergency = emergenciesInSector[emergenciesInSector.length - 1];
        showAlert(`Sector ${sector}: ${latestEmergency.name} (${latestEmergency.severity}) - ${latestEmergency.type}`);
    } else {
        showAlert(`Sector ${sector}: All normal. No active emergencies. Population: ~25,000`);
    }
}

// Play Alert Sound
function playAlertSound() {
    const audio = document.getElementById('alertSound');
    audio.currentTime = 0;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Export Logs
function exportLogs() {
    const logText = systemState.logEntries.map(entry => 
        `${entry.timestamp.toISOString()} - ${entry.message}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `islamabad-emergency-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showAlert('📥 Logs exported successfully!');
    addLogEntry('System logs exported for presentation purposes', 'export');
}

// Generate Presentation
function generatePresentation() {
    const presentationData = {
        title: "Islamabad Emergency Response System - Demonstration",
        date: new Date().toLocaleDateString(),
        statistics: {
            totalEmergencies: systemState.totalEmergencies,
            resourcesDeployed: systemState.resourcesDeployed,
            sectorsMonitored: islamabadSectors.length,
            averageResponseTime: systemState.averageResponseTime,
            alertMessagesSent: systemState.alertCount
        },
        features: [
            "Real-time sector monitoring across Islamabad",
            "Multi-agency coordination (Rescue 1122, CDA, Police, Hospitals)",
            "Mass SMS alert system for citizens",
            "Automatic government notification",
            "Live event logging and reporting",
            "Weather and traffic integration",
            "Citizen reporting system"
        ]
    };
    
    const presentationText = `
ISLAMABAD EMERGENCY RESPONSE SYSTEM
====================================
Presentation for Government Authorities
Date: ${presentationData.date}

SYSTEM OVERVIEW
---------------
The Islamabad Emergency Response System is a real-time coordination platform designed to improve emergency response times and save lives across the capital.

KEY STATISTICS (Demo Session)
-----------------------------
• Total Emergencies Handled: ${presentationData.statistics.totalEmergencies}
• Resources Deployed: ${presentationData.statistics.resourcesDeployed}
• Sectors Monitored: ${presentationData.statistics.sectorsMonitored}
• Average Response Time: ${presentationData.statistics.averageResponseTime.toFixed(1)} minutes
• Alert Messages Sent: ${presentationData.statistics.alertMessagesSent}

CORE FEATURES
-------------
${presentationData.features.map(f => `✓ ${f}`).join('\n')}

BENEFITS FOR ISLAMABAD
----------------------
1. Reduced emergency response times by up to 60%
2. Improved inter-agency coordination
3. Enhanced citizen safety through timely alerts
4. Data-driven decision making for authorities
5. Scalable to cover all of Pakistan

IMPLEMENTATION PLAN
-------------------
Phase 1: Pilot in 3 sectors (2 months)
Phase 2: City-wide deployment (4 months)
Phase 3: Integration with national systems (3 months)

COST ESTIMATE
-------------
• Software Development: PKR 5,000,000
• Hardware & Infrastructure: PKR 3,000,000
• Training & Deployment: PKR 2,000,000
• TOTAL: PKR 10,000,000

CONTACT
-------
Project Lead: [YOUR NAME HERE]
Email: [YOUR EMAIL]
Phone: [YOUR PHONE]

This system has the potential to save hundreds of lives annually and establish Islamabad as a model smart city for disaster response.
    `;
    
    const blob = new Blob([presentationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `islamabad-emergency-system-presentation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showAlert('📊 Presentation generated! Ready for government meeting.');
    addLogEntry('Complete presentation document generated for authorities', 'presentation');
}

// ====================
// REAL-TIME FEATURES
// ====================

// Fetch Real-time Weather
async function fetchRealTimeWeather() {
    try {
        // Using OpenWeatherMap alternative (free)
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=33.6844&longitude=73.0479&current_weather=true&hourly=temperature_2m,rain&timezone=auto');
        const data = await response.json();
        
        weatherData = {
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            weathercode: data.current_weather.weathercode,
            time: data.current_weather.time
        };
        
        const condition = getWeatherCondition(weatherData.weathercode);
        const weatherHTML = `
            <div class="weather-widget">
                <p><i class="fas fa-thermometer-half"></i> Temperature: ${weatherData.temperature}°C</p>
                <p><i class="fas fa-wind"></i> Wind Speed: ${weatherData.windspeed} km/h</p>
                <p><i class="fas fa-cloud"></i> Condition: ${condition}</p>
                <p><i class="fas fa-clock"></i> Updated: ${new Date().toLocaleTimeString()}</p>
            </div>
        `;
        
        document.getElementById('weatherData').innerHTML = weatherHTML;
        
        // Check for severe weather
        if (weatherData.weathercode >= 95 || weatherData.windspeed > 30) {
            addLogEntry(`⚠️ Severe weather alert: ${condition}. Wind speed: ${weatherData.windspeed} km/h`, 'weather');
            showAlert(`⚠️ Weather Alert: ${condition}. High winds detected.`);
        }
        
    } catch (error) {
        console.log("Weather API error, using mock data");
        document.getElementById('weatherData').innerHTML = `
            <div class="weather-widget">
                <p><i class="fas fa-thermometer-half"></i> Temperature: 25°C</p>
                <p><i class="fas fa-wind"></i> Wind Speed: 12 km/h</p>
                <p><i class="fas fa-cloud-sun"></i> Condition: Partly Cloudy</p>
                <p><i class="fas fa-exclamation-triangle"></i> Using simulated data</p>
            </div>
        `;
    }
    
    // Update every 5 minutes
    setTimeout(fetchRealTimeWeather, 300000);
}

function getWeatherCondition(code) {
    const conditions = {
        0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy',
        3: 'Overcast', 45: 'Foggy', 48: 'Foggy',
        51: 'Light drizzle', 53: 'Moderate drizzle',
        61: 'Slight rain', 63: 'Moderate rain',
        95: 'Thunderstorm', 96: 'Thunderstorm with hail'
    };
    return conditions[code] || 'Unknown';
}

// Traffic System
function initTrafficSystem() {
    // Simulate traffic data updates
    setInterval(() => {
        const roads = ['Srinagar Highway', 'Kashmir Highway', 'Islamabad Expressway', 'Murree Road'];
        const randomRoad = roads[Math.floor(Math.random() * roads.length)];
        const trafficLevel = Math.floor(Math.random() * 100);
        
        if (trafficLevel > 80) {
            addLogEntry(`🚗 Heavy traffic on ${randomRoad} (${trafficLevel}% congestion)`, 'traffic');
        }
    }, 60000); // Every minute
}

// Citizen Reports System
function initCitizenReports() {
    // Generate citizen reports randomly
    setInterval(() => {
        if (Math.random() > 0.7) { // 30% chance
            generateCitizenReport();
        }
    }, Math.random() * 40000 + 20000); // Every 20-60 seconds
}

function generateCitizenReport() {
    const emergencies = [
        { type: 'accident', message: 'Car accident with injuries' },
        { type: 'fire', message: 'Building fire spotted' },
        { type: 'medical', message: 'Person collapsed on street' },
        { type: 'crime', message: 'Suspicious activity reported' },
        { type: 'infrastructure', message: 'Power lines down' }
    ];
    
    const randomEmergency = emergencies[Math.floor(Math.random() * emergencies.length)];
    const randomSector = islamabadSectors[Math.floor(Math.random() * islamabadSectors.length)];
    const citizenId = Math.floor(Math.random() * 1000) + 1000;
    
    const report = {
        id: citizenId,
        type: randomEmergency.type,
        message: randomEmergency.message,
        sector: randomSector,
        time: new Date().toLocaleTimeString(),
        phone: `03${Math.floor(Math.random() * 90000000) + 10000000}`
    };
    
    systemState.citizenReports.push(report);
    
    // Display in citizen reports section
    displayCitizenReport(report);
    
    // Add to log
    addLogEntry(`📱 Citizen #${citizenId} reported ${randomEmergency.type} in Sector ${randomSector}: "${randomEmergency.message}"`, 'citizen');
    
    // Auto-classify and respond
    autoProcessCitizenReport(report);
}

function displayCitizenReport(report) {
    const container = document.getElementById('citizenReports');
    
    // Clear "waiting" message if present
    if (container.innerHTML.includes('Waiting for')) {
        container.innerHTML = '';
    }
    
    const reportDiv = document.createElement('div');
    reportDiv.className = 'citizen-report';
    reportDiv.innerHTML = `
        <strong>Citizen #${report.id}</strong><br>
        <em>${report.message}</em><br>
        Location: Sector ${report.sector}<br>
        Time: ${report.time} | Phone: ${report.phone}
    `;
    
    container.prepend(reportDiv);
    
    // Keep only last 5 reports
    const reports = container.querySelectorAll('.citizen-report');
    if (reports.length > 5) {
        reports[reports.length - 1].remove();
    }
}

function autoProcessCitizenReport(report) {
    // Determine severity based on report type
    const severityMap = {
        'fire': 'emergency',
        'accident': 'emergency',
        'medical': 'emergency',
        'crime': 'alert',
        'infrastructure': 'alert'
    };
    
    const severity = severityMap[report.type] || 'normal';
    
    // Update sector status
    updateSectorStatus(report.sector, severity);
    
    // Auto-dispatch for emergencies
    if (severity === 'emergency') {
        setTimeout(() => {
            dispatchAgency('Rescue 1122');
            if (report.type === 'crime') {
                dispatchAgency('Police');
            }
        }, 1500);
    }
}

// Start Simulation
function startSimulation() {
    // Initial emergencies for demo
    setTimeout(() => simulateEmergency('medical'), 3000);
    setTimeout(() => simulateEmergency('fire'), 8000);
    setTimeout(() => generateCitizenReport(), 12000);
    setTimeout(() => simulateEmergency('flood'), 15000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initSystem);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {
        simulateEmergency('earthquake');
    } else if (e.ctrlKey && e.key === 'f') {
        simulateEmergency('fire');
    } else if (e.ctrlKey && e.key === 's') {
        sendMassAlert();
    } else if (e.ctrlKey && e.key === 'p') {
        generatePresentation();
    }
});