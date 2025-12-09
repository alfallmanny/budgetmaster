// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Free product data
const freeProduct = {
    id: 'free-budget-template',
    name: 'Budgeting Template for Excel & Google Sheets',
    price: 0.00,
    originalPrice: 49.99,
    type: 'template'
};

// Carousel Management
let currentSlide = 0;
const totalSlides = 4;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    initializeMobileMenu();
    initializeCarousel();
    updateCartDisplay();
    lucide.createIcons();
});

// Carousel Functions
function initializeCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navDots = document.querySelectorAll('.nav-dot');
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', previousSlide);
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Add dot navigation
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-advance slides every 5 seconds
    setInterval(() => {
        nextSlide();
    }, 5000);
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    const navDots = document.querySelectorAll('.nav-dot');
    
    if (track) {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Update navigation dots
    navDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function previousSlide() {
    currentSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    updateCarousel();
}

function goToSlide(slideIndex) {
    currentSlide = slideIndex;
    updateCarousel();
}

// Cart Functions
function initializeCart() {
    // Create cart items display
    const cartItems = document.getElementById('cartItems');
    if (cartItems) {
        renderCartItems();
    }
}

function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '$0.00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    lucide.createIcons();
}

function addToCart(productId) {
    if (productId === freeProduct.id) {
        // Check if item already exists
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            showMessage('Template already in cart!', 'info');
            return;
        }
        
        cart.push(freeProduct);
        saveCart();
        updateCartDisplay();
        showMessage('Free template added to cart!', 'success');
    }
}

// Make addToCart function globally available
window.addToCart = addToCart;

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showMessage('Item removed from cart', 'info');
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const stickyCartCount = document.getElementById('stickyCartCount');
    
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
    
    if (stickyCartCount) {
        stickyCartCount.textContent = cart.length;
        if (cart.length > 0) {
            stickyCartCount.classList.add('show');
        } else {
            stickyCartCount.classList.remove('show');
        }
    }
    
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer && cartOverlay) {
        renderCartItems();
    }
}

// Cart Toggle
function toggleCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer && cartOverlay) {
        const isOpen = cartDrawer.classList.contains('open');
        
        if (isOpen) {
            cartDrawer.classList.remove('open');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        } else {
            cartDrawer.classList.add('open');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

// Download Free Template
function downloadFreeTemplate() {
    // Add to cart first
    addToCart('free-budget-template');
    
    // Simulate download process
    showMessage('Preparing your free template for download...', 'info');
    
    setTimeout(() => {
        // Create a mock download
        const link = document.createElement('a');
        link.href = '#';
        link.download = 'BudgetMaster_Pro_Free_Template.xlsx';
        
        // Show success message
        showMessage('Template download ready! Check your cart or email for download link.', 'success');
        
        // In a real implementation, this would trigger the actual download
        console.log('Free template download initiated');
    }, 1500);
}

// Mobile Menu Functions
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isOpen = navMenu.classList.contains('mobile-open');
            
            navMenu.classList.toggle('mobile-open');
            if (navActions) {
                navActions.classList.toggle('mobile-open');
            }
            mobileMenuBtn.classList.toggle('active');
            
            // Toggle hamburger icon
            const icon = mobileMenuBtn.querySelector('[data-lucide]');
            if (!isOpen) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }
}

// Checkout Function
function proceedToCheckout() {
    if (cart.length === 0) {
        showMessage('Your cart is empty', 'error');
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

// Message System
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message-notification');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `message-notification message-${type}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <i data-lucide="${getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                <i data-lucide="x"></i>
            </button>
        </div>
    `;
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .message-notification {
            position: fixed;
            top: 100px;
            right: 24px;
            z-index: 2000;
            max-width: 400px;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            animation: slideInRight 0.3s ease;
        }
        
        .message-info {
            background: #3b82f6;
            color: white;
        }
        
        .message-success {
            background: #10b981;
            color: white;
        }
        
        .message-error {
            background: #ef4444;
            color: white;
        }
        
        .message-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .message-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            padding: 4px;
            margin-left: auto;
            opacity: 0.8;
            transition: opacity 0.2s ease;
        }
        
        .message-close:hover {
            opacity: 1;
        }
        
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
    
    document.head.appendChild(styles);
    document.body.appendChild(messageEl);
    
    lucide.createIcons();
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (messageEl.parentElement) {
            messageEl.remove();
        }
    }, 4000);
}

function getMessageIcon(type) {
    const icons = {
        info: 'info',
        success: 'check-circle',
        error: 'x-circle'
    };
    return icons[type] || 'info';
}

// Event Listeners
document.addEventListener('click', function(e) {
    // Close cart when clicking outside
    if (e.target.classList.contains('cart-overlay')) {
        toggleCart();
    }
    
    // Close cart on escape key
    if (e.key === 'Escape') {
        const cartDrawer = document.getElementById('cartDrawer');
        if (cartDrawer && cartDrawer.classList.contains('open')) {
            toggleCart();
        }
    }
});

// Window resize handler
window.addEventListener('resize', function() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navMenu = document.querySelector('.nav-menu');
        const navActions = document.querySelector('.nav-actions');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        
        if (navMenu && navMenu.classList.contains('mobile-open')) {
            navMenu.classList.remove('mobile-open');
            if (navActions) {
                navActions.classList.remove('mobile-open');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('[data-lucide]');
                if (icon) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            }
        }
    }
});

// Add CSS for mobile menu
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @media (max-width: 768px) {
        .nav-menu.mobile-open,
        .nav-actions.mobile-open {
            display: flex !important;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 24px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            z-index: 999;
        }
        
        .nav-actions.mobile-open {
            top: auto;
            bottom: 0;
            border-top: 1px solid #f0f0f0;
        }
        
        .mobile-menu-btn.active svg {
            transform: rotate(90deg);
        }
    }
`;
document.head.appendChild(mobileStyles);