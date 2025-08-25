// FinValley 9.0 Application JavaScript
class FinValleyApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.currentTheme = 'light';
        this.charts = {};
        this.init();
    }

    init() {
        // Ensure DOM is ready before setting up event listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.initializeTheme();
                this.loadDemoData();
            });
        } else {
            this.setupEventListeners();
            this.initializeTheme();
            this.loadDemoData();
        }
    }

    setupEventListeners() {
        // Login form - Fixed event handling
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Also add click handler to login button directly
        const loginButton = document.querySelector('#login-form button[type="submit"]');
        if (loginButton) {
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchModule(e.target.dataset.module);
            });
        });

        // Quick action buttons
        const actionButtons = document.querySelectorAll('.action-btn');
        actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = e.currentTarget.dataset.action;
                this.switchModule(action);
            });
        });

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Carry module sliders
        this.setupCarrySliders();
        
        // Tokenization interactions
        this.setupTokenizationInteractions();
        
        // AI chat
        this.setupAIChat();
        
        // Button interactions
        this.setupButtonInteractions();
    }

    handleLogin(e) {
        if (e) {
            e.preventDefault();
        }
        
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (!emailField || !passwordField) {
            console.error('Login fields not found');
            return;
        }
        
        const email = emailField.value.trim();
        const password = passwordField.value.trim();

        console.log('Login attempt:', { email, password }); // Debug log

        // Demo credentials validation
        if (email === 'demo@finvalley.com' && password === 'demo2025') {
            console.log('Login successful'); // Debug log
            
            const loginScreen = document.getElementById('login-screen');
            const mainApp = document.getElementById('main-app');
            
            if (loginScreen && mainApp) {
                loginScreen.classList.add('hidden');
                mainApp.classList.remove('hidden');
                this.initializeCharts();
                this.showSuccessMessage('Welcome to FinValley 9.0!');
            } else {
                console.error('Screen elements not found');
            }
        } else {
            alert('Invalid credentials. Please use:\nEmail: demo@finvalley.com\nPassword: demo2025');
        }
    }

    handleLogout() {
        const mainApp = document.getElementById('main-app');
        const loginScreen = document.getElementById('login-screen');
        
        if (mainApp && loginScreen) {
            mainApp.classList.add('hidden');
            loginScreen.classList.remove('hidden');
        }
        
        // Reset form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.reset();
        }
        
        // Clear charts
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
        
        this.showInfoMessage('Logged out successfully');
    }

    switchModule(moduleId) {
        if (!moduleId) return;
        
        console.log('Switching to module:', moduleId); // Debug log
        
        // Hide all modules
        document.querySelectorAll('.module').forEach(module => {
            module.classList.add('hidden');
        });

        // Show selected module
        const targetModule = document.getElementById(`${moduleId}-module`);
        if (targetModule) {
            targetModule.classList.remove('hidden');
        } else {
            console.error(`Module not found: ${moduleId}-module`);
            return;
        }

        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-module="${moduleId}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        this.currentModule = moduleId;

        // Initialize module-specific features
        setTimeout(() => {
            this.initializeModuleFeatures(moduleId);
        }, 100);
    }

    initializeModuleFeatures(moduleId) {
        console.log('Initializing features for module:', moduleId);
        
        switch(moduleId) {
            case 'carry':
                this.initializeCarryCharts();
                break;
            case 'tokenization':
                this.initializeTokenizationCharts();
                break;
            case 'data':
                this.initializeDataCharts();
                break;
            case 'ai':
                this.initializeAICharts();
                break;
            default:
                console.log('No specific features for module:', moduleId);
        }
    }

    initializeTheme() {
        // Don't use localStorage in sandbox environment
        this.setTheme('light');
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        // Update charts with new theme
        setTimeout(() => {
            this.updateChartsTheme();
        }, 100);
    }

    setupCarrySliders() {
        const exitSlider = document.getElementById('exit-slider');
        const rollSlider = document.getElementById('roll-slider');
        const exitPercent = document.getElementById('exit-percent');
        const rollPercent = document.getElementById('roll-percent');

        if (exitSlider && rollSlider && exitPercent && rollPercent) {
            exitSlider.addEventListener('input', (e) => {
                const exitValue = parseInt(e.target.value);
                const rollValue = 100 - exitValue;
                
                exitPercent.textContent = `${exitValue}%`;
                rollPercent.textContent = `${rollValue}%`;
                rollSlider.value = rollValue;
                
                this.updateCarryCalculations(exitValue, rollValue);
            });

            rollSlider.addEventListener('input', (e) => {
                const rollValue = parseInt(e.target.value);
                const exitValue = 100 - rollValue;
                
                rollPercent.textContent = `${rollValue}%`;
                exitPercent.textContent = `${exitValue}%`;
                exitSlider.value = exitValue;
                
                this.updateCarryCalculations(exitValue, rollValue);
            });
        }
    }

    updateCarryCalculations(exitPercent, rollPercent) {
        console.log(`Updated carry calculations: ${exitPercent}% exit, ${rollPercent}% roll`);
        this.animateCarryModels();
    }

    animateCarryModels() {
        const carryModels = document.querySelectorAll('.carry-model');
        carryModels.forEach((model, index) => {
            setTimeout(() => {
                model.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    model.style.transform = 'scale(1)';
                }, 150);
            }, index * 100);
        });
    }

    setupTokenizationInteractions() {
        // Framework selection
        const frameworkCards = document.querySelectorAll('.framework-card');
        frameworkCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                frameworkCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.updateTokenizationConfig(card);
            });
        });
    }

    updateTokenizationConfig(selectedCard) {
        const frameworkName = selectedCard.querySelector('h4')?.textContent || 'Unknown';
        console.log(`Selected framework: ${frameworkName}`);
        
        // Animate selection
        selectedCard.style.transform = 'scale(1.02)';
        setTimeout(() => {
            selectedCard.style.transform = 'scale(1)';
        }, 200);
        
        this.showInfoMessage(`Selected ${frameworkName} framework`);
    }

    setupAIChat() {
        const chatInput = document.querySelector('.chat-input input');
        const sendButton = document.querySelector('.chat-input button');
        
        if (chatInput && sendButton) {
            const sendMessage = () => {
                const message = chatInput.value.trim();
                if (message) {
                    this.addChatMessage(message, 'user');
                    chatInput.value = '';
                    
                    // Show typing indicator
                    this.addChatMessage('AI is typing...', 'ai typing');
                    
                    // Simulate AI response
                    setTimeout(() => {
                        // Remove typing indicator
                        const typingMessage = document.querySelector('.chat-message.typing');
                        if (typingMessage) {
                            typingMessage.remove();
                        }
                        this.generateAIResponse(message);
                    }, 1500);
                }
            };

            sendButton.addEventListener('click', (e) => {
                e.preventDefault();
                sendMessage();
            });
            
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }

    addChatMessage(message, sender) {
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chat-message ${sender}`;
            messageDiv.innerHTML = `<p>${message}</p>`;
            
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    generateAIResponse(userMessage) {
        const responses = {
            'performance': 'Based on current market conditions and your portfolio composition, Fund ABC is performing 180 bps above benchmark. The infrastructure assets are benefiting from increased ESG focus and stable cash flows.',
            'nav': 'The NAV calculation incorporates real-time market data, independent valuations, and accrual adjustments. Current methodology follows ILPA guidelines with quarterly independent valuations.',
            'risk': 'Risk analysis shows moderate concentration in telecommunications infrastructure. I recommend diversification into renewable energy assets to reduce sector exposure.',
            'compliance': 'All funds are currently compliant with regulatory requirements. The automated monitoring system has flagged no issues for the current reporting period.',
            'default': 'I understand your question about the fund performance. Let me analyze the data for you. Fund ABC has shown strong performance with infrastructure assets driving growth through stable cash flows and ESG-focused investments.'
        };

        let response = responses.default;
        
        const messageLower = userMessage.toLowerCase();
        if (messageLower.includes('performance') || messageLower.includes('return')) {
            response = responses.performance;
        } else if (messageLower.includes('nav') || messageLower.includes('value')) {
            response = responses.nav;
        } else if (messageLower.includes('risk')) {
            response = responses.risk;
        } else if (messageLower.includes('compliance') || messageLower.includes('regulation')) {
            response = responses.compliance;
        }

        this.addChatMessage(response, 'ai');
    }

    setupButtonInteractions() {
        // Add click handlers for all interactive buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn:not(.nav-btn):not(#logout-btn):not(#theme-toggle):not([type="submit"])')) {
                this.handleButtonClick(e.target);
            }
        });
    }

    handleButtonClick(button) {
        const buttonText = button.textContent.trim();
        
        // Animate button press
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);

        // Handle specific button actions
        if (buttonText.includes('Generate') || buttonText.includes('Export')) {
            this.showSuccessMessage(`${buttonText} completed successfully!`);
        } else if (buttonText.includes('Place Order')) {
            this.showSuccessMessage('Order placed successfully in secondary market!');
        } else if (buttonText.includes('View Demo')) {
            this.showInfoMessage('Demo feature activated - explore the interface!');
        } else if (buttonText.includes('Send')) {
            // Handle send button in AI chat - already handled in setupAIChat
            return;
        } else {
            this.showInfoMessage(`${buttonText} functionality activated`);
        }
    }

    showSuccessMessage(message) {
        this.showNotification(message, 'success');
    }

    showInfoMessage(message) {
        this.showNotification(message, 'info');
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;

        if (type === 'success') {
            notification.style.background = '#21807d';
        } else if (type === 'info') {
            notification.style.background = '#626c71';
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    initializeCharts() {
        console.log('Initializing charts...');
        // Initialize charts with delay to ensure DOM is ready
        setTimeout(() => {
            this.initializeCarryCharts();
            this.initializeDataCharts(); 
            this.initializeAICharts();
        }, 500);
    }

    initializeCarryCharts() {
        const performanceCanvas = document.getElementById('performance-chart');
        if (performanceCanvas && !this.charts.performance) {
            const ctx = performanceCanvas.getContext('2d');
            this.charts.performance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
                    datasets: [{
                        label: 'Fund NAV ($M)',
                        data: [400, 450, 520, 580, 620, 590, 640, 680, 720, 680],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Distributions ($M)',
                        data: [0, 20, 45, 80, 120, 180, 250, 320, 420, 520],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Fund ABC Performance Timeline'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Value ($M)'
                            }
                        }
                    }
                }
            });
        }
    }

    initializeDataCharts() {
        const roiCanvas = document.getElementById('roi-chart');
        if (roiCanvas && !this.charts.roi) {
            const ctx = roiCanvas.getContext('2d');
            this.charts.roi = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Year 1', 'Year 2', 'Year 3', 'Cumulative'],
                    datasets: [{
                        label: 'Implementation Cost',
                        data: [-2.5, 0, 0, -2.5],
                        backgroundColor: '#B4413C',
                        borderRadius: 4
                    }, {
                        label: 'Annual Benefits',
                        data: [0.8, 1.8, 1.8, 4.4],
                        backgroundColor: '#1FB8CD',
                        borderRadius: 4
                    }, {
                        label: 'Net ROI',
                        data: [-1.7, 1.8, 1.8, 1.9],
                        backgroundColor: '#5D878F',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Data Hub Implementation ROI Analysis'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    },
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Value ($M)'
                            }
                        }
                    }
                }
            });
        }
    }

    initializeAICharts() {
        const analyticsCanvas = document.getElementById('performance-analytics-chart');
        if (analyticsCanvas && !this.charts.analytics) {
            const ctx = analyticsCanvas.getContext('2d');
            this.charts.analytics = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Infrastructure', 'Private Equity', 'Real Estate', 'Credit', 'Other'],
                    datasets: [{
                        data: [45, 25, 15, 10, 5],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Portfolio Allocation by Strategy'
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }
    }

    updateChartsTheme() {
        // Update chart colors based on theme
        const isDark = this.currentTheme === 'dark';
        const textColor = isDark ? '#f5f5f5' : '#134252';
        const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                // Update text colors
                if (chart.options.plugins && chart.options.plugins.title) {
                    chart.options.plugins.title.color = textColor;
                }
                if (chart.options.plugins && chart.options.plugins.legend) {
                    chart.options.plugins.legend.labels = {
                        ...chart.options.plugins.legend.labels,
                        color: textColor
                    };
                }
                
                // Update scales
                if (chart.options.scales) {
                    Object.keys(chart.options.scales).forEach(scaleKey => {
                        const scale = chart.options.scales[scaleKey];
                        if (scale.title) {
                            scale.title.color = textColor;
                        }
                        if (scale.ticks) {
                            scale.ticks.color = textColor;
                        } else {
                            scale.ticks = { color: textColor };
                        }
                        if (scale.grid) {
                            scale.grid.color = gridColor;
                        }
                    });
                }
                
                chart.update('none');
            }
        });
    }

    loadDemoData() {
        console.log('Loading FinValley 9.0 demo data...');
        this.updateDashboardMetrics();
        this.simulateRealTimeUpdates();
    }

    updateDashboardMetrics() {
        // Add subtle animations to metrics
        const metricCards = document.querySelectorAll('.metric-card');
        metricCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0.7';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 100);
            }, index * 200);
        });
    }

    simulateRealTimeUpdates() {
        // Simulate periodic updates
        setInterval(() => {
            this.updateSystemMetrics();
        }, 30000);

        // Simulate data processing updates
        setInterval(() => {
            this.updateDataPipeline();
        }, 5000);
    }

    updateSystemMetrics() {
        const uptimeElement = document.querySelector('.metric-card:last-child .metric-value');
        if (uptimeElement && uptimeElement.textContent.includes('%')) {
            const currentUptime = parseFloat(uptimeElement.textContent);
            const newUptime = (currentUptime + (Math.random() * 0.1 - 0.05)).toFixed(1);
            uptimeElement.textContent = `${Math.max(99.0, Math.min(100.0, newUptime))}%`;
        }
    }

    updateDataPipeline() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width) || 70;
            if (currentWidth < 100) {
                const increment = Math.random() * 2;
                const newWidth = Math.min(100, currentWidth + increment);
                bar.style.width = `${newWidth}%`;
            }
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing FinValley app...');
    window.finValleyApp = new FinValleyApp();
});

// Fallback initialization if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM already loaded, initializing FinValley app...');
    window.finValleyApp = new FinValleyApp();
}

// Additional utility functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatPercent(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}