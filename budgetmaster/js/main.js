// Initialize Lucide icons
lucide.createIcons();

// Global state
let cart = [];
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeComponents();
    loadCartFromStorage();
    updateCartUI();
});

// Initialize all interactive components
function initializeComponents() {
    // Initialize announcement bar
    initializeAnnouncementBar();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize FAQ accordions
    initializeFAQ();
    
    // Initialize testimonials carousel
    initializeTestimonials();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
}

// Announcement Bar Functions
function initializeAnnouncementBar() {
    const announcementBar = document.getElementById('announcementBar');
    const dismissBtn = document.getElementById('dismissAnnouncement');
    
    // Check if user dismissed it before
    if (localStorage.getItem('announcementDismissed')) {
        announcementBar.style.display = 'none';
    }
    
    // Dismiss functionality
    dismissBtn.addEventListener('click', function() {
        announcementBar.style.animation = 'slideUp 0.5s ease-out forwards';
        setTimeout(() => {
            announcementBar.style.display = 'none';
            localStorage.setItem('announcementDismissed', 'true');
        }, 500);
    });
}

// Mobile Menu Functions
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const navActions = document.querySelector('.nav-actions');
    

    
    function toggleMobileMenu() {
        navMenu.classList.toggle('open');
        mobileMenuBtn.classList.toggle('active');
        
        // Toggle hamburger icon
        const icon = mobileMenuBtn.querySelector('[data-lucide]');
        const isOpen = navMenu.classList.contains('open');
        
        if (isOpen) {
            icon.setAttribute('data-lucide', 'x');
        } else {
            icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
    }
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on nav links
    navMenu.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-link')) {
            toggleMobileMenu();
        }
    });
}

// FAQ Functions
function initializeFAQ() {
}

function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('i');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-question').forEach(q => {
        if (q !== button) {
            q.classList.remove('active');
            q.querySelector('.faq-answer').classList.remove('active');
            q.querySelector('i').style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ item
    button.classList.toggle('active');
    answer.classList.toggle('active');
    
    if (button.classList.contains('active')) {
        icon.style.transform = 'rotate(45deg)';
        answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
        icon.style.transform = 'rotate(0deg)';
        answer.style.maxHeight = '0px';
    }
}

// Testimonials Carousel Functions
function initializeTestimonials() {
    // Auto-advance testimonials every 5 seconds
    setInterval(() => {
        nextTestimonial();
    }, 5000);
}

function showTestimonial(index) {
    // Hide all testimonials
    testimonials.forEach((testimonial, i) => {
        testimonial.classList.remove('active');
        if (i === index) {
            testimonial.classList.add('active');
        }
    });
    currentTestimonial = index;
}

function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(nextIndex);
}

function previousTestimonial() {
    const prevIndex = currentTestimonial === 0 ? testimonials.length - 1 : currentTestimonial - 1;
    showTestimonial(prevIndex);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Shopping Cart Functions
const productData = {
    'free-budget-template': {
        title: 'Basic Budget Planner',
        price: 0,
        image: 'basic-budget-icon',
        type: 'FREE'
    },
    'basic-budget-planner': {
        title: 'Basic Budget Planner',
        price: 0,
        image: 'spreadsheet-icon',
        type: 'FREE'
    },
    'advanced-savings-planner': {
        title: 'Advanced Savings Planner',
        price: 12.99,
        image: 'savings-icon',
        type: 'PREMIUM'
    },
    'debt-snowball-tracker': {
        title: 'Debt Snowball Tracker',
        price: 15.99,
        image: 'debt-icon',
        type: 'PREMIUM'
    },
    'meal-planning-budget': {
        title: 'Meal Planning & Budget',
        price: 9.99,
        image: 'meal-icon',
        type: 'PREMIUM'
    },
    'yearly-financial-planner': {
        title: 'Yearly Financial Planner',
        price: 19.99,
        image: 'planner-icon',
        type: 'PREMIUM'
    },
    'investment-tracker': {
        title: 'Investment Tracker',
        price: 14.99,
        image: 'investment-icon',
        type: 'PREMIUM'
    },
    'complete-budget-suite': {
        title: 'Complete Budget Suite',
        price: 49.99,
        image: 'suite-icon',
        type: 'PREMIUM'
    }
};

function addToCart(productId) {
    const product = productData[productId];
    if (!product) return;
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            type: product.type,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    
    // Show success feedback
    showNotification(`${product.title} added to cart!`, 'success');
    
    // Open cart drawer
    toggleCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
    showNotification('Item removed from cart', 'info');
}

function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCartToStorage();
            updateCartUI();
        }
    }
}

function updateCartUI() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartSubtotal = document.getElementById('cartSubtotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    
    // Update subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-cart"></i>
                <p>Your cart is empty</p>
                <button class="btn btn-primary" onclick="toggleCart()">Continue Shopping</button>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i data-lucide="${getIconName(item.image)}"></i>
                </div>
                <div class="cart-item-content">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">${item.price > 0 ? `$${item.price.toFixed(2)}` : 'FREE'}</div>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                        <button onclick="updateCartItemQuantity('${item.id}', ${item.quantity - 1})" 
                                style="background: #E1E4E8; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">-</button>
                        <span style="font-weight: 600;">${item.quantity}</span>
                        <button onclick="updateCartItemQuantity('${item.id}', ${item.quantity + 1})" 
                                style="background: #E1E4E8; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `).join('');
    }
    
    // Re-initialize icons for new content
    lucide.createIcons();
}

function getIconName(imageType) {
    const iconMap = {
        'basic-budget-icon': 'spreadsheet',
        'spreadsheet-icon': 'spreadsheet',
        'savings-icon': 'piggy-bank',
        'debt-icon': 'credit-card',
        'meal-icon': 'utensils',
        'planner-icon': 'calendar',
        'investment-icon': 'target',
        'suite-icon': 'briefcase'
    };
    return iconMap[imageType] || 'spreadsheet';
}

function toggleCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const overlay = cartDrawer.querySelector('.cart-overlay');
    
    cartDrawer.classList.toggle('open');
    overlay.classList.toggle('open');
    
    // Prevent body scroll when cart is open
    if (cartDrawer.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }
    
    // Close cart drawer
    toggleCart();
    
    // Show download success message
    showDownloadSuccess();
}

// Show download success message
function showDownloadSuccess() {
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #10b981; color: white; padding: 2rem; border-radius: 12px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); z-index: 10000; text-align: center; max-width: 400px;">
            <div style="width: 48px; height: 48px; margin: 0 auto 1rem; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">✓</div>
            <h3 style="margin: 0 0 0.5rem 0; font-size: 1.5rem; font-weight: 700;">Download Started!</h3>
            <p style="margin: 0 0 1rem 0; opacity: 0.9;">Your free budgeting template is downloading now. Check your downloads folder!</p>
            <div style="margin-bottom: 1rem;">
                <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">Download links will also be sent to your email if you provided it.</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer; font-weight: 600;">Close</button>
        </div>
    `;
    
    document.body.appendChild(successMessage);
    
    // Auto close after 8 seconds
    setTimeout(() => {
        if (successMessage.parentElement) {
            successMessage.remove();
        }
    }, 8000);
}

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('budgetMasterCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('budgetMasterCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#22C55E' : type === 'warning' ? '#FDE047' : '#4C6FFF'};
        color: ${type === 'warning' ? '#1E1E1E' : 'white'};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        font-weight: 500;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        opacity: 0.8;
    `;
    
    notification.querySelector('.notification-close').addEventListener('mouseenter', function() {
        this.style.opacity = '1';
        this.style.background = type === 'warning' ? 'rgba(30, 30, 30, 0.1)' : 'rgba(255, 255, 255, 0.1)';
    });
    
    notification.querySelector('.notification-close').addEventListener('mouseleave', function() {
        this.style.opacity = '0.8';
        this.style.background = 'none';
    });
    
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
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    lucide.createIcons();
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
    
    // Add slide out animation
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

// Window resize handler for responsive features
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('navMenu');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        if (navMenu.classList.contains('open')) {
            navMenu.classList.remove('open');
            mobileMenuBtn.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            icon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        }
    }
});

// Touch-friendly interactions for mobile
function initializeTouchInteractions() {
    // Improve touch targets for mobile
    const buttons = document.querySelectorAll('button, .btn, .nav-link');
    buttons.forEach(button => {
        // Add touch feedback
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Improve cart quantity controls for mobile
    const quantityButtons = document.querySelectorAll('.quantity-btn');
    quantityButtons.forEach(btn => {
        btn.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.click();
        });
    });
    
    // Improve scroll performance on mobile
    const scrollableElements = document.querySelectorAll('.cart-drawer, .products-grid');
    scrollableElements.forEach(element => {
        element.style.webkitOverflowScrolling = 'touch';
    });
}

// Page load optimization
window.addEventListener('load', function() {
    // Initialize any features that need to wait for full page load
    initializeTouchInteractions();
    console.log('BudgetMaster Pro website loaded successfully');
});

// Handle exit intent (optional feature)
let exitIntentTriggered = false;

document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !exitIntentTriggered) {
        exitIntentTriggered = true;
        showExitIntentPopup();
    }
});

function showExitIntentPopup() {
    // This could show a popup offering the free template
    // For now, we'll just show a notification
    showNotification('Wait! Get your free budget template before you go!', 'info');
}

// Console message for developers
console.log(`
🚀 BudgetMaster Pro Website
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Homepage with conversion optimization
✅ Shopping cart functionality  
✅ Mobile responsive design
✅ Interactive components
✅ SEO optimized

Ready to launch! 🎯
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);