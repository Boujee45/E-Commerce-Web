//Mobile menu toggle

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
})

window.addEventListener('click', () => {
    if(navLinks.classList.contains("open"))
    {
        navLinks.classList.remove("open")
    }
})



//search toggle Functionality 

const searchToggle = document.getElementById('search-toggle');
const searchContainer = document.getElementById('search-container');

searchToggle.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
});

const slides = document.querySelectorAll(".testimonial-slide");
const dots = document.querySelectorAll(".testimonial-dot");

let index = 0;

function showSlide(n)
{
    slides.forEach(slide => slide.style.display = "none");
    dots.forEach(dot => dot.classList.remove("active"));

    slides[n].style.display = "block";
    dots[n].classList.add("active");
}

function autoSlide()
{
    index++;
    if (index >= slides.length) index = 0;
    showSlide(index);
}

showSlide(index);
setInterval(autoSlide, 4000);

dots.forEach(dot => {
    dot.addEventListener("click", function()
{
    index = parseInt(this.dataset.slide);
    showSlide(index);
});

});

//Nav Links Active

const navLink = document.querySelectorAll('.nav__link');

navLink.forEach((link) => {
    link.addEventListener("click", () => {
        navLink.forEach(L => L.classList.remove('active'));

        link.classList.add('active');
    });
});


// --- DOM Element Selection ---
const cartCount = document.getElementById('cart-count');
const cartPanel = document.getElementById('cartPanel');
const cartIcon = document.getElementById('cart-icon');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const addToCartButtons = document.querySelectorAll('.add-to-cart'); // Target all 'Add to Cart' buttons

// Mock Data structure for the cart
let cart = [];


// ---Quantity Control Logic---

cartItemsContainer.addEventListener('click', (e) => {
    // Check if the clicked element is one of the control buttons
    if (e.target.classList.contains('quantity-btn') || e.target.classList.contains('remove-all-btn')) {
        const itemId = e.target.getAttribute('data-id');
        const action = e.target.getAttribute('data-action');
        
        if (action === 'increment' || action === 'decrement') {
            //logic for +/- buttons 
            changeQuantity(itemId, action);
        } else if (action === 'remove') {
            // Call the function for the trash icon
            removeAllItem(itemId);
        }
    }
});





// --- Functions ---

/**
 * Updates the item count in the header icon.
 */
function updateCartCount() {
    // Calculate the total number of items (sum of quantities)
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

/**
 * Recalculates the total price.
 */
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = total.toFixed(2);
}

/**
 * Renders the items in the cart panel with +/- buttons and a trash icon.
 */
function renderCart() {
    
    cartItemsContainer.innerHTML = ''; // Clear previous content

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <strong>${item.name}</strong>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button data-id="${item.id}" data-action="decrement" class="quantity-btn">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button data-id="${item.id}" data-action="increment" class="quantity-btn">+</button>
                </div>
            </div>
            <p class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
            
            <button data-id="${item.id}" data-action="remove" class="remove-all-btn">
                🗑️ 
            </button>
        `;
        cartItemsContainer.appendChild(itemDiv);
    });

    updateCartTotal();
}


/**
 * Saves the current state of the cart array to the browser's Local Storage.
 */
function saveCartToLocalStorage() {
    // Convert the JavaScript array into a JSON string for storage
    localStorage.setItem('shopEaseCart', JSON.stringify(cart));
}

/**
 * Loads the cart array from Local Storage when the page starts.
 */
function loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('shopEaseCart');
    if (storedCart) {
        // Convert the JSON string back into a JavaScript array
        cart = JSON.parse(storedCart);
    }
    // If nothing is stored, 'cart' remains the empty array
}


document.addEventListener('DOMContentLoaded', () => {
    // 1. Load the cart data from storage first
    loadCartFromLocalStorage(); // <-- CRITICAL: Load saved data

    // 2. Initial rendering based on loaded data
    renderCart();
    updateCartCount(); 

    // 5. Quantity Control and Removal Logic (Event delegation)
    cartItemsContainer.addEventListener('click', (e) => {
        
    });
    
});






/**
 * Handles adding an item to the cart.
 * @param {object} itemData - The item details (id, name, price, image).
 */
function addItemToCart(itemData) {
    const existingItem = cart.find(item => item.id === itemData.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...itemData, quantity: 1 });
    }

    updateCartCount();
    renderCart();
    saveCartToLocalStorage(); // <-- New: Save cart after adding item
}


    


/**
 * Changes the quantity of an item in the cart.
 * This is called by the +/- buttons.
 */
function changeQuantity(itemId, action) {
    const item = cart.find(i => i.id == itemId);

    if (!item) return;

    if (action === 'increment') {
        item.quantity++;
    } else if (action === 'decrement') {
        item.quantity--;
        
        // Removal logic when quantity hits zero
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id != itemId); // Remove the item
        }
    }

    // 1. Re-render the whole cart and update the count/total
    renderCart();
    updateCartCount();
    updateCartTotal(); // <-- CRITICAL: Ensure this is called here too!
    
    // 2. Save the new state
    saveCartToLocalStorage(); // New function for persistence
}


/**
 * Removes an item completely from the cart, regardless of quantity.
 * This is called by the Trash Icon.
 */
function removeAllItem(itemId) {
    // 1. Filter out the item with the matching ID
    cart = cart.filter(item => item.id != itemId);

    // 2. Update the display and count/total
    renderCart();
    updateCartCount();
    updateCartTotal(); // <-- CRITICAL: Ensure this is called
    
    // 3. Save the new state
    saveCartToLocalStorage(); // New function for persistence
    
    if (cart.length === 0) {
        cartPanel.classList.remove('open');
    }
}



/**
 * Handles removing an item from the cart.
 */
function removeItemFromCart(itemId) {
    const itemIndex = cart.findIndex(item => item.id == itemId);

    if (itemIndex > -1) {
        // Decrement quantity or remove completely if quantity is 1
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
        } else {
            cart.splice(itemIndex, 1);
        }
    }

    updateCartCount();
    renderCart();
}

// --- Event Listeners ---

// 1. Toggle Cart Panel
cartIcon.addEventListener('click', (e) => {
    e.preventDefault();
    cartPanel.classList.toggle('open');
});

// 2. Close Cart Panel
closeCartBtn.addEventListener('click', () => {
    cartPanel.classList.remove('open');
});

// 3. Add to Cart Logic (Simulated Product Data)
document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            // Retrieve product data from button attributes (You must add these to your HTML!)
            const product = {
                id: e.target.getAttribute('data-id'),
                name: e.target.getAttribute('data-name'),
                price: parseFloat(e.target.getAttribute('data-price')),
                image: e.target.getAttribute('data-img') // e.g., 'headphone.jpg'
            };

            if (product.id && product.name && !isNaN(product.price)) {
                addItemToCart(product);
            }
        });
    });

    //Remove Item Logic (Event delegation for dynamically added buttons)
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-item-btn')) {
            const itemId = e.target.getAttribute('data-id');
            removeItemFromCart(itemId);
        }
    });

    // Initial render when the page loads
    renderCart(); 
});

