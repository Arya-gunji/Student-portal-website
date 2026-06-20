// Main JavaScript for Restaurant Website

// Global cart state
let cart = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Load cart from localStorage
    cart = getCartFromStorage();
    
    // Display menu items
    displayMenuItems('all');
    
    // Setup event listeners
    setupEventListeners();
    
    // Update cart badge
    updateCartBadge();
    
    // Display cart if there are items
    if (cart.length > 0) {
        displayCart();
    }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Get category and filter menu
            const category = this.getAttribute('data-category');
            displayMenuItems(category);
        });
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#cartModal') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Animate stats when section is visible
    setupStatsAnimation();
}

/**
 * Display menu items based on category
 * @param {string} category - Category to filter by
 */
function displayMenuItems(category) {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    // Show loading state
    menuContainer.innerHTML = '<div class="col-12"><div class="loading"><i class="fas fa-spinner"></i><p>Loading menu...</p></div></div>';
    
    // Get menu items
    const items = getMenuItemsByCategory(category);
    
    // Simulate loading delay for better UX
    setTimeout(() => {
        if (items.length === 0) {
            menuContainer.innerHTML = '<div class="col-12 text-center py-5"><h3>No items found in this category</h3></div>';
            return;
        }
        
        // Clear container
        menuContainer.innerHTML = '';
        
        // Create menu cards
        items.forEach(item => {
            const menuCard = createMenuCard(item);
            menuContainer.appendChild(menuCard);
        });
    }, 300);
}

/**
 * Create a menu card element
 * @param {Object} item - Menu item object
 * @returns {HTMLElement} Menu card element
 */
function createMenuCard(item) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    col.innerHTML = `
        <div class="menu-card">
            <img src="${item.image}" alt="${item.name}" class="menu-card-image" onerror="this.src='https://via.placeholder.com/400x200?text=${encodeURIComponent(item.name)}'">
            <div class="menu-card-body">
                <h5 class="menu-card-title">${item.name}</h5>
                <p class="menu-card-description">${item.description}</p>
                <div class="menu-card-footer">
                    <span class="menu-card-price">${formatPrice(item.price)}</span>
                    <button class="btn btn-add-to-cart" onclick="addItemToCart(${item.id})">
                        <i class="fas fa-plus me-1"></i>Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

/**
 * Add item to cart
 * @param {number} itemId - ID of the item to add
 */
function addItemToCart(itemId) {
    // Get all menu items
    const allItems = getAllMenuItems();
    const menuItem = allItems.find(item => item.id === itemId);
    
    if (!menuItem) {
        showNotification('Item not found!', 'error');
        return;
    }
    
    // Add to cart
    cart = addToCart(cart, menuItem);
    
    // Save to localStorage
    saveCartToStorage(cart);
    
    // Update UI
    updateCartBadge();
    displayCart();
    
    // Show notification
    showNotification(`${menuItem.name} added to cart!`, 'success');
}

/**
 * Update cart badge count
 */
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    if (badge) {
        const count = getCartItemCount(cart);
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

/**
 * Display cart items in modal
 */
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <h4>Your cart is empty</h4>
                <p>Add some delicious items to get started!</p>
            </div>
        `;
        updateCartTotals();
        return;
    }
    
    // Clear container
    cartItemsContainer.innerHTML = '';
    
    // Display each cart item
    cart.forEach(item => {
        const cartItemElement = createCartItemElement(item);
        cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Update totals
    updateCartTotals();
}

/**
 * Create cart item element
 * @param {Object} item - Cart item object
 * @returns {HTMLElement} Cart item element
 */
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.setAttribute('data-item-id', item.id);
    
    cartItem.innerHTML = `
        <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${formatPrice(item.price)} each</div>
        </div>
        <div class="cart-item-controls">
            <div class="quantity-control">
                <button class="btn btn-quantity" onclick="decreaseQuantity(${item.id})">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="btn btn-quantity" onclick="increaseQuantity(${item.id})">
                    <i class="fas fa-plus"></i>
                </button>
            </div>
            <div class="ms-3">
                <strong>${formatPrice(item.price * item.quantity)}</strong>
            </div>
            <button class="btn btn-remove ms-3" onclick="removeItemFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return cartItem;
}

/**
 * Increase item quantity
 * @param {number} itemId - ID of the item
 */
function increaseQuantity(itemId) {
    const item = findCartItem(cart, itemId);
    if (item) {
        cart = updateCartItemQuantity(cart, itemId, item.quantity + 1);
        saveCartToStorage(cart);
        updateCartBadge();
        displayCart();
    }
}

/**
 * Decrease item quantity
 * @param {number} itemId - ID of the item
 */
function decreaseQuantity(itemId) {
    const item = findCartItem(cart, itemId);
    if (item && item.quantity > 1) {
        cart = updateCartItemQuantity(cart, itemId, item.quantity - 1);
        saveCartToStorage(cart);
        updateCartBadge();
        displayCart();
    }
}

/**
 * Remove item from cart
 * @param {number} itemId - ID of the item to remove
 */
function removeItemFromCart(itemId) {
    const item = findCartItem(cart, itemId);
    if (item) {
        cart = removeFromCart(cart, itemId);
        saveCartToStorage(cart);
        updateCartBadge();
        displayCart();
        showNotification(`${item.name} removed from cart`, 'info');
    }
}

/**
 * Update cart totals (subtotal, tax, total)
 */
function updateCartTotals() {
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    
    const subtotalElement = document.getElementById('cartSubtotal');
    const taxElement = document.getElementById('cartTax');
    const totalElement = document.getElementById('cartTotal');
    
    if (subtotalElement) subtotalElement.textContent = formatPrice(subtotal);
    if (taxElement) taxElement.textContent = formatPrice(tax);
    if (totalElement) totalElement.textContent = formatPrice(total);
}

/**
 * Handle checkout process
 */
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Calculate totals
    const subtotal = calculateSubtotal(cart);
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);
    
    // Show confirmation
    const confirmMessage = `
        Order Summary:
        Items: ${getCartItemCount(cart)}
        Subtotal: ${formatPrice(subtotal)}
        Tax: ${formatPrice(tax)}
        Total: ${formatPrice(total)}
        
        Proceed with checkout?
    `;
    
    if (confirm(confirmMessage)) {
        // Process checkout (in a real app, this would send data to a server)
        showNotification('Order placed successfully! Thank you for your order!', 'success');
        
        // Clear cart
        cart = clearCart();
        saveCartToStorage(cart);
        updateCartBadge();
        displayCart();
        
        // Close modal
        const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
        if (cartModal) {
            cartModal.hide();
        }
    }
}

/**
 * Update cart display when modal is shown
 */
document.addEventListener('shown.bs.modal', function(event) {
    if (event.target.id === 'cartModal') {
        displayCart();
    }
});

/**
 * Handle contact form submission with validation
 * @param {Event} event - Form submit event
 */
function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');

    let isValid = true;

    if (!name.value.trim()) {
        name.classList.add('is-invalid');
        isValid = false;
    } else {
        name.classList.remove('is-invalid');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
    } else {
        email.classList.remove('is-invalid');
    }

    if (message.value.trim().length < 10) {
        message.classList.add('is-invalid');
        isValid = false;
    } else {
        message.classList.remove('is-invalid');
    }

    if (isValid) {
        showNotification(`Thank you ${name.value}! We will reply soon.`, 'success');
        form.reset();
    } else {
        showNotification('Please fix the errors in the form.', 'error');
    }
}

/**
 * Animate stat numbers when stats section enters viewport
 */
function setupStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length === 0) return;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumber(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));
}

/**
 * Count up animation for stat numbers
 * @param {HTMLElement} element - Stat number element
 */
function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1500;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Navbar scroll effect + scroll to top button visibility
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.98) 0%, rgba(247, 147, 30, 0.98) 100%)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        scrollTopBtn?.classList.add('show');
    } else {
        navbar.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.95) 0%, rgba(247, 147, 30, 0.95) 100%)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        scrollTopBtn?.classList.remove('show');
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe menu cards for animation
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const menuCards = document.querySelectorAll('.menu-card');
        menuCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `all 0.5s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    }, 500);
});
