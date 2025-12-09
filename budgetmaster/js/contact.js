// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeQuickFAQ();
});

function initializeContactForm() {
    // Form validation and handling
    const form = document.getElementById('contactForm');
    const categorySelect = document.getElementById('category');
    const prioritySelect = document.getElementById('priority');
    
    // Auto-adjust priority based on category
    categorySelect.addEventListener('change', function() {
        if (this.value === 'billing') {
            prioritySelect.value = 'urgent';
        } else if (this.value === 'technical') {
            prioritySelect.value = 'high';
        }
    });
    
    // Character counter for message field
    const messageField = document.getElementById('message');
    const maxLength = 2000;
    
    messageField.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        let counter = document.querySelector('.message-counter');
        
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'message-counter';
            counter.style.cssText = `
                text-align: right;
                font-size: 12px;
                color: #5A5A5A;
                margin-top: 4px;
            `;
            this.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${remaining} characters remaining`;
        
        if (remaining < 100) {
            counter.style.color = '#EF4444';
        } else {
            counter.style.color = '#5A5A5A';
        }
    });
}

function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'category', 'subject', 'message'];
    let isValid = true;
    
    requiredFields.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Validate email format
    const emailField = form.querySelector('[name="email"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate privacy checkbox
    const privacyCheckbox = form.querySelector('[name="privacy"]');
    if (!privacyCheckbox.checked) {
        showNotification('You must agree to the Privacy Policy and Terms of Service', 'warning');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i data-lucide="loader-2" style="animation: spin 1s linear infinite;"></i> Sending...';
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
        // In a real implementation, this would send to your backend
        console.log('Form data:', Object.fromEntries(formData));
        
        // Show success message
        showContactSuccess();
        
        // Reset form
        form.reset();
        
        // Restore button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        lucide.createIcons();
        
        // Track form submission
        trackEvent('Contact Form Submitted', {
            category: formData.get('category'),
            priority: formData.get('priority'),
            has_order_number: !!formData.get('orderNumber')
        });
        
    }, 2000);
}

function showFieldError(field, message) {
    clearFieldError(field);
    field.style.borderColor = '#EF4444';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.cssText = `
        color: #EF4444;
        font-size: 12px;
        margin-top: 4px;
    `;
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showContactSuccess() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div class="success-modal">
            <div class="success-content">
                <div class="success-icon">
                    <i data-lucide="check-circle" style="width: 64px; height: 64px; color: #22C55E;"></i>
                </div>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting us. We've received your message and will respond within the timeframe specified for your inquiry type.</p>
                <div class="response-info">
                    <p><strong>What happens next:</strong></p>
                    <ul>
                        <li>You'll receive a confirmation email shortly</li>
                        <li>Our team will review your inquiry</li>
                        <li>We'll respond with the estimated timeframe</li>
                        <li>You'll receive updates via email</li>
                    </ul>
                </div>
                <button class="btn btn-primary" onclick="closeSuccessModal()">Continue</button>
            </div>
        </div>
    `;
    
    successMessage.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const successContent = successMessage.querySelector('.success-content');
    successContent.style.cssText = `
        background: white;
        padding: 48px;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(successMessage);
    lucide.createIcons();
    
    // Close on backdrop click
    successMessage.addEventListener('click', function(e) {
        if (e.target === successMessage) {
            closeSuccessModal();
        }
    });
}

function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.remove();
    }
}

function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        showNotification('Email address copied to clipboard!', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Email address copied to clipboard!', 'success');
    });
}

function openLiveChat() {
    // In a real implementation, this would open a live chat widget
    showNotification('Live chat is currently unavailable. Please email us at support@budgetmasterpro.com', 'info');
    
    // Track chat attempt
    trackEvent('Live Chat Attempted');
}

function initializeQuickFAQ() {
    // FAQ items are clickable and toggle on page load
}

function toggleQuickFAQ(element) {
    // Remove active state from other items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== element) {
            item.classList.remove('active');
        }
    });
    
    // Toggle current item
    element.classList.toggle('active');
}

// Auto-fill form for returning users
function prefillForm() {
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');
    
    if (userEmail) {
        document.getElementById('email').value = userEmail;
    }
    
    if (userName) {
        const [firstName, lastName] = userName.split(' ');
        document.getElementById('firstName').value = firstName || '';
        document.getElementById('lastName').value = lastName || '';
    }
}

// Save user info for next visit
function saveUserInfo() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    
    if (firstName && lastName) {
        localStorage.setItem('userName', `${firstName} ${lastName}`);
    }
    
    if (email) {
        localStorage.setItem('userEmail', email);
    }
}

// Call saveUserInfo on form blur events
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm select');
    formFields.forEach(field => {
        field.addEventListener('blur', saveUserInfo);
    });
    
    // Pre-fill form for returning users
    prefillForm();
});

// Form analytics
function trackFormInteraction(action, field) {
    trackEvent('Contact Form Interaction', {
        action: action,
        field: field,
        form_completion_rate: calculateFormCompletion()
    });
}

function calculateFormCompletion() {
    const form = document.getElementById('contactForm');
    const totalFields = form.querySelectorAll('input, select, textarea').length;
    const filledFields = Array.from(form.querySelectorAll('input, select, textarea'))
        .filter(field => field.value.trim()).length;
    
    return Math.round((filledFields / totalFields) * 100);
}

// Add analytics tracking to form fields
document.addEventListener('DOMContentLoaded', function() {
    const formFields = document.querySelectorAll('#contactForm input, #contactForm select, #contactForm textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', () => trackFormInteraction('focus', field.name));
        field.addEventListener('blur', () => trackFormInteraction('blur', field.name));
    });
});

// Exit intent detection for contact form
let exitIntentShown = false;

document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        showExitIntentOffer();
    }
});

function showExitIntentOffer() {
    const offer = document.createElement('div');
    offer.innerHTML = `
        <div class="exit-intent-modal">
            <div class="exit-intent-content">
                <div class="exit-intent-header">
                    <h3>Wait! Need Help Right Now?</h3>
                    <button class="close-btn" onclick="closeExitIntentOffer()">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="exit-intent-body">
                    <p>Before you go, would you like immediate help with your budgeting templates?</p>
                    <div class="quick-actions">
                        <button class="btn btn-primary" onclick="openLiveChat(); closeExitIntentOffer();">
                            <i data-lucide="message-square"></i>
                            Start Live Chat
                        </button>
                        <button class="btn btn-secondary" onclick="window.open('help.html'); closeExitIntentOffer();">
                            <i data-lucide="help-circle"></i>
                            Browse Help Center
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    offer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10001;
    `;
    
    const content = offer.querySelector('.exit-intent-content');
    content.style.cssText = `
        background: white;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        overflow: hidden;
    `;
    
    document.body.appendChild(offer);
    lucide.createIcons();
    
    // Track exit intent
    trackEvent('Exit Intent Shown');
}

function closeExitIntentOffer() {
    const offer = document.querySelector('.exit-intent-modal');
    if (offer) {
        offer.remove();
    }
}

// Performance monitoring
function measurePagePerformance() {
    if (window.performance && window.performance.timing) {
        const timing = window.performance.timing;
        const loadTime = timing.loadEventEnd - timing.navigationStart;
        
        trackEvent('Page Load Performance', {
            load_time: loadTime,
            dom_ready: timing.domContentLoadedEventEnd - timing.navigationStart,
            first_paint: timing.responseEnd - timing.navigationStart
        });
    }
}

// Call performance measurement
document.addEventListener('DOMContentLoaded', measurePagePerformance);

// Form validation patterns
const validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[1-9][\d]{0,15}$/,
    orderNumber: /^BM\d{4}-\d{5}$/
};

// Add real-time validation
document.addEventListener('DOMContentLoaded', function() {
    const emailField = document.getElementById('email');
    const orderField = document.getElementById('orderNumber');
    
    emailField.addEventListener('input', function() {
        if (this.value && !validationPatterns.email.test(this.value)) {
            this.style.borderColor = '#FDE047';
        } else {
            this.style.borderColor = '';
        }
    });
    
    orderField.addEventListener('input', function() {
        if (this.value && !validationPatterns.orderNumber.test(this.value)) {
            this.placeholder = 'Format: BM2025-12345';
            this.style.borderColor = '#FDE047';
        } else {
            this.placeholder = 'e.g., BM2025-12345';
            this.style.borderColor = '';
        }
    });
});

// Utility functions
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

// Analytics helper
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // In real implementation: gtag('event', eventName, properties);
}

// Export for global access
window.contactFunctions = {
    submitContactForm,
    copyEmail,
    openLiveChat,
    toggleQuickFAQ,
    closeSuccessModal
};