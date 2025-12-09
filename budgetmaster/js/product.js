// Product Page Specific JavaScript

// Gallery Thumbnail Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeGallery();
    initializeProductFAQ();
});

function initializeGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image (in a real implementation, this would change the image)
            // For demo purposes, we'll just update the icon
            const icons = ['briefcase', 'spreadsheet', 'pie-chart', 'trending-up'];
            const mainIcon = mainImage.querySelector('i');
            if (mainIcon) {
                mainIcon.setAttribute('data-lucide', icons[index]);
                lucide.createIcons();
            }
        });
    });
}

function initializeProductFAQ() {
    // Product page FAQ functionality is handled by main.js toggleFAQ function
}

// Buy Now Functionality
function buyNow(productId) {
    // Add to cart first
    addToCart(productId);
    
    // Then proceed to checkout immediately
    setTimeout(() => {
        proceedToCheckout();
    }, 500);
}

// Enhanced Add to Cart with product-specific logic
function addToCartWithDetails(productId, quantity = 1) {
    const product = productData[productId];
    if (!product) return;
    
    // Add to cart with quantity
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            type: product.type,
            quantity: quantity
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    
    // Show success message with details
    showNotification(`${product.title} added to cart!`, 'success');
    
    // Track analytics event (in real implementation)
    trackEvent('Add to Cart', {
        product_id: productId,
        product_name: product.title,
        price: product.price,
        quantity: quantity
    });
}

// Social Sharing Functions
function shareProduct(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('Check out this amazing budget template!');
    const text = encodeURIComponent('I found this great budgeting template that helped me save money!');
    
    let shareUrl = '';
    
    switch(platform) {
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${text}%20${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Wishlist Functionality
let wishlist = JSON.parse(localStorage.getItem('budgetMasterWishlist')) || [];

function toggleWishlist(productId) {
    const product = productData[productId];
    if (!product) return;
    
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`${product.title} removed from wishlist`, 'info');
    } else {
        wishlist.push(productId);
        showNotification(`${product.title} added to wishlist!`, 'success');
    }
    
    localStorage.setItem('budgetMasterWishlist', JSON.stringify(wishlist));
    updateWishlistButton(productId);
}

function updateWishlistButton(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"] .wishlist-btn`);
    if (button) {
        const isInWishlist = wishlist.includes(productId);
        button.classList.toggle('active', isInWishlist);
        const icon = button.querySelector('i');
        icon.setAttribute('data-lucide', isInWishlist ? 'heart' : 'heart');
        lucide.createIcons();
    }
}

// Product Reviews System (Mock)
const productReviews = [
    {
        id: 1,
        author: "Sarah M.",
        rating: 5,
        date: "2024-11-15",
        title: "Changed my financial life!",
        content: "This complete suite has everything I needed. The savings tracker alone helped me save $500 in the first month. Highly recommend!",
        verified: true
    },
    {
        id: 2,
        author: "Mike R.",
        rating: 5,
        date: "2024-11-08",
        title: "Best investment I've made",
        content: "For the price of one dinner out, I got tools that will save me thousands. The debt snowball tracker is genius.",
        verified: true
    },
    {
        id: 3,
        author: "Jennifer L.",
        rating: 4,
        date: "2024-10-22",
        title: "Great templates, easy to use",
        content: "Very comprehensive set of templates. Took me about 30 minutes to set everything up, now I track everything automatically.",
        verified: true
    }
];

function renderReviews() {
    const reviewsContainer = document.querySelector('.reviews-container');
    if (!reviewsContainer) return;
    
    const averageRating = productReviews.reduce((sum, review) => sum + review.rating, 0) / productReviews.length;
    
    reviewsContainer.innerHTML = `
        <div class="reviews-summary">
            <div class="rating-overview">
                <span class="average-rating">${averageRating.toFixed(1)}</span>
                <div class="stars">
                    ${Array(5).fill().map((_, i) => 
                        `<i data-lucide="star" class="${i < Math.round(averageRating) ? 'filled' : ''}"></i>`
                    ).join('')}
                </div>
                <span class="total-reviews">${productReviews.length} reviews</span>
            </div>
        </div>
        <div class="reviews-list">
            ${productReviews.map(review => `
                <div class="review-item">
                    <div class="review-header">
                        <div class="reviewer-info">
                            <span class="reviewer-name">${review.author}</span>
                            ${review.verified ? '<span class="verified-badge">Verified Purchase</span>' : ''}
                        </div>
                        <div class="review-rating">
                            ${Array(review.rating).fill().map(() => '<i data-lucide="star" class="filled"></i>').join('')}
                        </div>
                    </div>
                    <div class="review-date">${formatDate(review.date)}</div>
                    <h4 class="review-title">${review.title}</h4>
                    <p class="review-content">${review.content}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    lucide.createIcons();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Product Comparison
function compareWithProduct(productId) {
    // In a real implementation, this would open a comparison modal
    showNotification('Product comparison feature coming soon!', 'info');
}

// Recently Viewed
function addToRecentlyViewed(productId) {
    let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already exists
    recentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to beginning
    recentlyViewed.unshift(productId);
    
    // Keep only last 10 items
    recentlyViewed = recentlyViewed.slice(0, 10);
    
    localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
}

// Stock Status
function checkStockStatus(productId) {
    // Mock stock check - in real implementation this would be an API call
    return {
        inStock: true,
        quantity: 999, // Unlimited for digital products
        lowStock: false
    };
}

// Price Calculator (for different currencies)
function calculatePrice(basePrice, currency = 'USD', exchangeRate = 1) {
    const rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        CAD: 1.25,
        AUD: 1.35
    };
    
    const rate = rates[currency] || 1;
    return (basePrice * rate * exchangeRate).toFixed(2);
}

// Analytics Event Tracking (Mock)
function trackEvent(eventName, properties = {}) {
    // In a real implementation, this would send to analytics service
    console.log('Event tracked:', eventName, properties);
}

// Product Performance Analytics
function trackProductView(productId) {
    trackEvent('Product View', {
        product_id: productId,
        product_name: productData[productId]?.title || 'Unknown',
        category: 'budget_templates'
    });
    
    addToRecentlyViewed(productId);
}

// Call trackProductView when page loads
document.addEventListener('DOMContentLoaded', function() {
    const productId = 'complete-budget-suite'; // This would be dynamic in real implementation
    trackProductView(productId);
});

// A/B Testing Support
function getExperimentVariant(experimentName) {
    const experiments = JSON.parse(localStorage.getItem('abTests')) || {};
    return experiments[experimentName] || 'control';
}

function setExperimentVariant(experimentName, variant) {
    const experiments = JSON.parse(localStorage.getItem('abTests')) || {};
    experiments[experimentName] = variant;
    localStorage.setItem('abTests', JSON.stringify(experiments));
}

// Initialize product page features
function initializeProductPage() {
    // Add any product-specific initialization here
    console.log('Product page initialized');
}

// Export functions for use by other scripts
window.productPageFunctions = {
    addToCartWithDetails,
    shareProduct,
    toggleWishlist,
    renderReviews,
    compareWithProduct,
    calculatePrice,
    trackEvent,
    trackProductView
};