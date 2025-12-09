// Catalog Page JavaScript

// Product data with all metadata
const productsData = [
    {
        id: 'basic-budget-planner',
        title: 'Basic Budget Planner',
        category: 'budget',
        description: 'Perfect starting template for beginners with simple monthly income and expense tracking.',
        price: 0,
        originalPrice: null,
        rating: 4.8,
        downloads: 12500,
        difficulty: 'beginner',
        formats: ['excel', 'sheets', 'pdf'],
        features: ['Excel', 'Google Sheets', 'PDF'],
        icon: 'spreadsheet',
        badge: 'free',
        isPopular: true
    },
    {
        id: 'advanced-savings-planner',
        title: 'Advanced Savings Planner',
        category: 'savings',
        description: 'Multi-goal savings tracker with automated calculations and visual progress tracking.',
        price: 12.99,
        originalPrice: null,
        rating: 4.9,
        downloads: 8900,
        difficulty: 'intermediate',
        formats: ['excel', 'sheets'],
        features: ['Excel', 'Google Sheets'],
        icon: 'piggy-bank',
        badge: null,
        isPopular: true
    },
    {
        id: 'debt-snowball-tracker',
        title: 'Debt Snowball Tracker',
        category: 'debt',
        description: 'Strategic debt payoff planner with payment scheduling and visual progress tracking.',
        price: 15.99,
        originalPrice: null,
        rating: 4.9,
        downloads: 7200,
        difficulty: 'intermediate',
        formats: ['excel', 'sheets', 'notion'],
        features: ['Excel', 'Google Sheets', 'Notion'],
        icon: 'credit-card',
        badge: null,
        isPopular: true
    },
    {
        id: 'meal-planning-budget',
        title: 'Meal Planning & Budget',
        category: 'meal',
        description: 'Weekly meal planner with grocery budget tracking and cost analysis.',
        price: 9.99,
        originalPrice: null,
        rating: 4.7,
        downloads: 5600,
        difficulty: 'beginner',
        formats: ['excel', 'sheets'],
        features: ['Excel', 'Google Sheets'],
        icon: 'utensils',
        badge: null,
        isPopular: false
    },
    {
        id: 'yearly-financial-planner',
        title: 'Yearly Financial Planner',
        category: 'planning',
        description: 'Comprehensive annual budget with monthly breakdowns and goal tracking.',
        price: 19.99,
        originalPrice: null,
        rating: 4.8,
        downloads: 4800,
        difficulty: 'advanced',
        formats: ['excel', 'sheets', 'pdf'],
        features: ['Excel', 'Google Sheets', 'PDF'],
        icon: 'calendar',
        badge: null,
        isPopular: false
    },
    {
        id: 'investment-tracker',
        title: 'Investment Tracker',
        category: 'investment',
        description: 'Portfolio performance tracker with dividend tracking and ROI analysis.',
        price: 14.99,
        originalPrice: null,
        rating: 4.6,
        downloads: 3400,
        difficulty: 'advanced',
        formats: ['excel', 'sheets'],
        features: ['Excel', 'Google Sheets'],
        icon: 'target',
        badge: null,
        isPopular: false
    },
    {
        id: 'expense-tracker',
        title: 'Daily Expense Tracker',
        category: 'expense',
        description: 'Detailed daily expense tracking with categorization and reporting.',
        price: 7.99,
        originalPrice: null,
        rating: 4.5,
        downloads: 6800,
        difficulty: 'beginner',
        formats: ['excel', 'sheets'],
        features: ['Excel', 'Google Sheets'],
        icon: 'receipt',
        badge: 'sale',
        isPopular: false
    },
    {
        id: 'complete-budget-suite',
        title: 'Complete Budget Suite',
        category: 'planning',
        description: 'All templates in one package - best value for serious budgeters.',
        price: 49.99,
        originalPrice: 69.99,
        rating: 4.9,
        downloads: 2100,
        difficulty: 'all',
        formats: ['excel', 'sheets', 'pdf', 'notion'],
        features: ['All Formats', 'Lifetime Updates'],
        icon: 'briefcase',
        badge: 'bestseller',
        isPopular: true,
        isBundle: true
    }
];

// Global variables
let filteredProducts = [...productsData];
let currentPage = 1;
const productsPerPage = 6;
let currentViewMode = 'grid';

// Initialize catalog page
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    updateResultsInfo();
    initializeFilters();
    loadUserPreferences();
});

function initializeFilters() {
    // Set default filter values
    document.getElementById('sortBy').value = 'popular';
    
    // Add event listeners for better UX
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const price = document.getElementById('priceFilter').value;
    const format = document.getElementById('formatFilter').value;
    const difficulty = document.getElementById('difficultyFilter').value;
    const search = document.getElementById('searchInput').value.toLowerCase();
    const sortBy = document.getElementById('sortBy').value;
    
    // Filter products
    filteredProducts = productsData.filter(product => {
        // Category filter
        if (category !== 'all' && product.category !== category) {
            return false;
        }
        
        // Price filter
        if (price !== 'all') {
            if (price === 'free' && product.price > 0) return false;
            if (price === 'under-15' && product.price >= 15) return false;
            if (price === '15-30' && (product.price < 15 || product.price > 30)) return false;
            if (price === 'over-30' && product.price <= 30) return false;
        }
        
        // Format filter
        if (format !== 'all' && !product.formats.includes(format)) {
            return false;
        }
        
        // Difficulty filter
        if (difficulty !== 'all' && product.difficulty !== difficulty) {
            return false;
        }
        
        // Search filter
        if (search && !product.title.toLowerCase().includes(search) && 
            !product.description.toLowerCase().includes(search)) {
            return false;
        }
        
        return true;
    });
    
    // Sort products
    sortProducts(filteredProducts, sortBy);
    
    // Reset to first page
    currentPage = 1;
    
    // Render products
    renderProducts();
    updateResultsInfo();
    updateActiveFilters();
    
    // Save filter preferences
    saveFilterPreferences();
    
    // Track filter usage
    trackEvent('Catalog Filters Applied', {
        category,
        price,
        format,
        difficulty,
        search_term: search,
        results_count: filteredProducts.length
    });
}

function sortProducts(products, sortBy) {
    switch (sortBy) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            products.sort((a, b) => b.rating - a.rating);
            break;
        case 'newest':
            // Mock newest sorting - in real app would use date
            products.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'name':
            products.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'popular':
        default:
            products.sort((a, b) => b.downloads - a.downloads);
            break;
    }
}

function renderProducts() {
    const container = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');
    
    if (filteredProducts.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    container.style.display = 'grid';
    noResults.style.display = 'none';
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Set view mode class
    container.className = `products-grid ${currentViewMode === 'list' ? 'list-view' : ''}`;
    
    container.innerHTML = paginatedProducts.map(product => renderProductCard(product)).join('');
    
    // Re-initialize Lucide icons
    lucide.createIcons();
    
    // Render pagination
    renderPagination();
    
    // Initialize product interactions
    initializeProductInteractions();
}

function renderProductCard(product) {
    const badgeClass = product.badge ? `product-badge ${product.badge}` : '';
    const difficultyBadge = product.difficulty !== 'all' ? 
        `<div class="difficulty-badge">${capitalizeFirst(product.difficulty)}</div>` : '';
    
    const originalPriceHtml = product.originalPrice ? 
        `<span class="price-original">$${product.originalPrice.toFixed(2)}</span>` : '';
    
    const priceHtml = product.price > 0 ? 
        `<span class="price">$${product.price.toFixed(2)}</span>` :
        `<span class="price">FREE</span>`;
    
    // Add "out of stock" for all products except the free one
    const isOutOfStock = product.price > 0;
    const outOfStockBadge = isOutOfStock ? 
        `<div class="out-of-stock-badge">Out of Stock</div>` : '';
    
    // Map products to different template images
    const templateImages = {
        'basic-budget-planner': 'imgs/template-1.webp',
        'advanced-savings-planner': 'imgs/template-2.webp',
        'debt-snowball-tracker': 'imgs/template-3.webp',
        'meal-planning-budget': 'imgs/template-4.webp',
        'yearly-financial-planner': 'imgs/template-1.webp',
        'investment-tracker': 'imgs/template-2.webp',
        'expense-tracker': 'imgs/template-3.webp',
        'complete-budget-suite': 'imgs/template-4.webp'
    };
    
    const imageSrc = templateImages[product.id] || 'imgs/template-1.webp';
    
    return `
        <div class="product-card ${isOutOfStock ? 'out-of-stock' : ''}" data-product-id="${product.id}">
            ${product.badge ? `<div class="${badgeClass}">${getBadgeText(product.badge)}</div>` : ''}
            ${outOfStockBadge}
            <div class="product-image">
                <div class="template-preview">
                    <img src="${imageSrc}" alt="${product.title}" class="template-image">
                </div>
                ${difficultyBadge}
            </div>
            <div class="product-content">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                
                <div class="product-meta">
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.rating})</span>
                    </div>
                    <div class="product-downloads">
                        ${formatNumber(product.downloads)} downloads
                    </div>
                </div>
                
                <div class="product-features">
                    ${product.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
                
                <div class="product-price">
                    ${priceHtml} ${originalPriceHtml}
                </div>
                
                <div class="product-actions">
                    <button class="btn btn-primary ${isOutOfStock ? 'disabled' : ''}" 
                            onclick="addToCart('${product.id}')" 
                            ${isOutOfStock ? 'disabled' : ''}>
                        <i data-lucide="shopping-cart"></i>
                        ${product.price > 0 ? 'Add to Cart' : 'Download Free'}
                    </button>
                    <button class="quick-add-btn ${isOutOfStock ? 'disabled' : ''}" 
                            onclick="quickAdd('${product.id}')" 
                            title="Quick add"
                            ${isOutOfStock ? 'disabled' : ''}>
                        <i data-lucide="plus"></i>
                    </button>
                    ${!product.isBundle ? `<button class="btn btn-secondary" onclick="viewProduct('${product.id}')">View Details</button>` : ''}
                </div>
                ${isOutOfStock ? '<div class="out-of-stock-overlay"><i data-lucide="package-x"></i></div>' : ''}
            </div>
        </div>
    `;
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    
    let paginationHtml = '';
    
    // Previous button
    paginationHtml += `
        <button onclick="changePage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>
            <i data-lucide="chevron-left"></i>
        </button>
    `;
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        paginationHtml += `<button onclick="changePage(1)">1</button>`;
        if (startPage > 2) {
            paginationHtml += `<span>...</span>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHtml += `
            <button onclick="changePage(${i})" ${i === currentPage ? 'class="active"' : ''}>
                ${i}
            </button>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHtml += `<span>...</span>`;
        }
        paginationHtml += `<button onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    
    // Next button
    paginationHtml += `
        <button onclick="changePage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>
            <i data-lucide="chevron-right"></i>
        </button>
    `;
    
    pagination.innerHTML = paginationHtml;
    lucide.createIcons();
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    updateResultsInfo();
    
    // Scroll to top of products
    document.querySelector('.catalog-products').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    
    // Track page change
    trackEvent('Catalog Page Changed', {
        page: page,
        results_per_page: productsPerPage,
        total_results: filteredProducts.length
    });
}

function updateResultsInfo() {
    const resultsCount = document.getElementById('resultsCount');
    const total = filteredProducts.length;
    const showing = Math.min(currentPage * productsPerPage, total);
    
    resultsCount.textContent = `Showing ${showing} of ${total} templates`;
}

function updateActiveFilters() {
    const activeFilters = document.getElementById('activeFilters');
    const filters = getActiveFilters();
    
    if (Object.keys(filters).length === 0) {
        activeFilters.innerHTML = '';
        return;
    }
    
    let filterHtml = '';
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
            filterHtml += `
                <div class="filter-tag">
                    ${getFilterLabel(key, value)}
                    <button class="remove-filter" onclick="removeFilter('${key}', '${value}')">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            `;
        }
    });
    
    activeFilters.innerHTML = filterHtml;
    lucide.createIcons();
}

function getActiveFilters() {
    return {
        category: document.getElementById('categoryFilter').value,
        price: document.getElementById('priceFilter').value,
        format: document.getElementById('formatFilter').value,
        difficulty: document.getElementById('difficultyFilter').value,
        search: document.getElementById('searchInput').value
    };
}

function removeFilter(filterKey, filterValue) {
    const elementId = {
        category: 'categoryFilter',
        price: 'priceFilter',
        format: 'formatFilter',
        difficulty: 'difficultyFilter',
        search: 'searchInput'
    }[filterKey];
    
    if (elementId) {
        const element = document.getElementById(elementId);
        if (element.tagName === 'SELECT') {
            element.value = 'all';
        } else {
            element.value = '';
        }
        applyFilters();
    }
}

function clearAllFilters() {
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priceFilter').value = 'all';
    document.getElementById('formatFilter').value = 'all';
    document.getElementById('difficultyFilter').value = 'all';
    document.getElementById('searchInput').value = '';
    applyFilters();
    
    // Track filter clearing
    trackEvent('Catalog Filters Cleared');
}

function setViewMode(mode) {
    currentViewMode = mode;
    const buttons = document.querySelectorAll('.view-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    event.target.closest('.view-btn').classList.add('active');
    
    renderProducts();
    saveUserPreferences();
    
    // Track view mode change
    trackEvent('Catalog View Mode Changed', { mode });
}

function quickAdd(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    addToCart(productId);
    
    // Visual feedback
    showQuickAddFeedback(productId);
}

function showQuickAddFeedback(productId) {
    const card = document.querySelector(`[data-product-id="${productId}"]`);
    if (!card) return;
    
    const button = card.querySelector('.quick-add-btn');
    const originalContent = button.innerHTML;
    
    button.innerHTML = '<i data-lucide="check"></i>';
    button.style.background = '#22C55E';
    button.style.color = 'white';
    
    setTimeout(() => {
        button.innerHTML = originalContent;
        button.style.background = '';
        button.style.color = '';
        lucide.createIcons();
    }, 1000);
}

function viewProduct(productId) {
    // In a real implementation, this would navigate to product detail page
    window.location.href = `product-${productId}.html`;
}

function openTemplateGuide() {
    // Mock implementation - would open modal or guide page
    showNotification('Template guide coming soon! Check our help center for recommendations.', 'info');
}

// Utility functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i data-lucide="star" class="filled"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i data-lucide="star-half"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i data-lucide="star"></i>';
    }
    
    return stars;
}

function getCategoryName(category) {
    const names = {
        budget: 'Budget Planning',
        savings: 'Savings & Goals',
        debt: 'Debt Management',
        expense: 'Expense Tracking',
        planning: 'Financial Planning',
        investment: 'Investment Tracking',
        meal: 'Meal Planning'
    };
    return names[category] || category;
}

function getBadgeText(badge) {
    const texts = {
        free: 'FREE',
        premium: 'PREMIUM',
        sale: 'SALE',
        bestseller: 'BESTSELLER',
        new: 'NEW'
    };
    return texts[badge] || badge.toUpperCase();
}

function getFilterLabel(key, value) {
    const labels = {
        category: `Category: ${getCategoryName(value)}`,
        price: `Price: ${value.replace('-', ' - $')}`,
        format: `Format: ${value.toUpperCase()}`,
        difficulty: `Level: ${capitalizeFirst(value)}`,
        search: `Search: "${value}"`
    };
    return labels[key] || value;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
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

// User preferences
function saveFilterPreferences() {
    const filters = getActiveFilters();
    localStorage.setItem('catalogFilters', JSON.stringify(filters));
}

function loadUserPreferences() {
    const savedFilters = localStorage.getItem('catalogFilters');
    if (savedFilters) {
        const filters = JSON.parse(savedFilters);
        Object.entries(filters).forEach(([key, value]) => {
            const elementId = {
                category: 'categoryFilter',
                price: 'priceFilter',
                format: 'formatFilter',
                difficulty: 'difficultyFilter',
                search: 'searchInput'
            }[key];
            
            if (elementId && value && value !== 'all') {
                document.getElementById(elementId).value = value;
            }
        });
    }
}

function saveUserPreferences() {
    localStorage.setItem('catalogViewMode', currentViewMode);
}

function loadCatalogPreferences() {
    const savedViewMode = localStorage.getItem('catalogViewMode');
    if (savedViewMode) {
        currentViewMode = savedViewMode;
        // Update view button
        setTimeout(() => {
            const buttons = document.querySelectorAll('.view-btn');
            buttons.forEach(btn => btn.classList.remove('active'));
            const activeButton = currentViewMode === 'grid' ? 
                document.querySelector('.view-btn[title="Grid View"]') :
                document.querySelector('.view-btn[title="List View"]');
            if (activeButton) {
                activeButton.classList.add('active');
            }
        }, 100);
    }
}

// Initialize product interactions
function initializeProductInteractions() {
    // Add hover effects and analytics
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = card.getAttribute('data-product-id');
        
        card.addEventListener('mouseenter', () => {
            trackEvent('Product Hover', { product_id: productId });
        });
        
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-actions')) {
                trackEvent('Product Click', { product_id: productId });
            }
        });
    });
}

// Search suggestions (mock implementation)
function showSearchSuggestions(query) {
    // In a real implementation, this would show autocomplete suggestions
    console.log('Search suggestions for:', query);
}

// Analytics and tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
    // In real implementation: gtag('event', eventName, properties);
}

// Mobile filter toggle functionality
function toggleMobileFilters() {
    const filterToggle = document.querySelector('.filter-toggle');
    const filtersMobile = document.getElementById('filtersMobile');
    
    if (filtersMobile.classList.contains('open')) {
        filtersMobile.classList.remove('open');
        filterToggle.classList.remove('active');
    } else {
        filtersMobile.classList.add('open');
        filterToggle.classList.add('active');
    }
}

// Load preferences when page loads
document.addEventListener('DOMContentLoaded', loadCatalogPreferences);

// Export functions for global access
window.catalogFunctions = {
    applyFilters,
    clearAllFilters,
    setViewMode,
    changePage,
    quickAdd,
    viewProduct,
    openTemplateGuide,
    toggleMobileFilters
};