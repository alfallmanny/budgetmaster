// Simple Shopify-Style Product Page JavaScript

// Image gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeImageGallery();
    initializeAccordions();
    initializeCart();
    initializeMobileMenu();
});

// Initialize Image Gallery
function initializeImageGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImageSrc = document.getElementById('mainImageSrc');
    
    // Thumbnail click handlers
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            
            // Update main image
            mainImageSrc.src = imageSrc;
            
            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
        
        // Keyboard navigation
        thumbnail.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize Accordions
function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion__details');
    
    accordions.forEach(accordion => {
        accordion.addEventListener('toggle', function() {
            // Close other accordions when one opens
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== this && otherAccordion.open) {
                    otherAccordion.open = false;
                }
            });
        });
    });
}

// Simple Add to Cart Function
function addToCartSimple() {
    const button = document.querySelector('.product-form__cart-submit');
    const originalText = button.innerHTML;
    
    // Show loading state
    button.innerHTML = '<span>Adding to Cart...</span>';
    button.disabled = true;
    
    // Simulate processing time
    setTimeout(() => {
        // Use the main site's addToCart function by calling it with the product ID
        if (typeof window.addToCart === 'function') {
            window.addToCart('free-budget-template');
        } else {
            // Fallback: if the main function isn't available, call it directly
            addToCartToMainSystem('free-budget-template');
        }
        
        // Reset button
        button.innerHTML = originalText;
        button.disabled = false;
        
    }, 800);
}

// Fallback function to add to cart using the main system
function addToCartToMainSystem(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Define the free product (matching the main site's freeProduct)
    const freeProduct = {
        id: 'free-budget-template',
        name: 'Budgeting template for Excel & Google sheets (all currencies)',
        price: 0.00,
        originalPrice: 49.99,
        type: 'template'
    };
    
    // Check if item already exists
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        showNotification('Template already in cart!');
        return;
    }
    
    // Add item to cart
    cart.push(freeProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update display
    updateCartDisplay();
    showNotification('Free template added to cart!');
}



// Render cart items in the cart drawer
function renderCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItems = document.getElementById('cartItems');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
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
    }
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
    showNotification('Item removed from cart');
}

// Update cart display
function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cartCount');
    const stickyCartCount = document.getElementById('stickyCartCount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update header cart count
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';
    }
    
    // Update floating cart count
    if (stickyCartCount) {
        stickyCartCount.textContent = cart.length;
        if (cart.length > 0) {
            stickyCartCount.classList.add('show');
        } else {
            stickyCartCount.classList.remove('show');
        }
    }
    
    // Update cart total
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    // Re-render cart items if drawer is open
    renderCartItems();
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Slide in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Slide out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Cart toggle function (shared with main site)
function toggleCart() {
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartDrawer && cartOverlay) {
        cartDrawer.classList.toggle('open');
        cartOverlay.classList.toggle('open');
        document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
    }
}

// Initialize cart display
function initializeCart() {
    updateCartDisplay();
}

// Mobile menu functions (shared with main site)
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            mobileMenuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
                mobileMenuBtn.classList.remove('active');
            }
        });
    }
}

// Material Icons Fallback (since we're using Lucide, we don't need this, but keeping for compatibility)
document.addEventListener('DOMContentLoaded', function() {
    // If Material Icons aren't loaded, replace with Lucide icons
    const materialIcons = document.querySelectorAll('.material-icon');
    const iconMap = {
        'check_box': 'check-square'
    };
    
    materialIcons.forEach(icon => {
        const iconName = icon.textContent.trim();
        if (iconMap[iconName]) {
            icon.innerHTML = `<i data-lucide="${iconMap[iconName]}"></i>`;
        }
    });
    
    // Reinitialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});