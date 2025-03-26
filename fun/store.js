import { getAuth, getFirestore } from '../firebase/firebase-config.js';
import { formatCoins } from './coins.js';

// Define store items with online images and categories
const STORE_ITEMS = [
    {
        id: 'theme-1',
        name: 'Cyberpunk Neon',
        description: 'Immersive cyberpunk-themed interface',
        price: 100,
        category: 'Themes',
        image: 'https://i.etsystatic.com/22439432/r/il/c95905/4402318272/il_fullxfull.4402318272_36aj.jpg'
    },
    {
        id: 'music-1',
        name: 'Tokyo Rain Beats',
        description: 'Soothing lo-fi track with city ambiance',
        price: 150,
        category: 'Music',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxsb2ZpJTIwbXVzaWN8ZW58MHx8fHwxNzExMzYyNDAwfDA&ixlib=rb-4.0.3&q=80&w=1080'
    },
    {
        id: 'effect-1',
        name: 'Cosmic Particle Effect',
        description: 'Mesmerizing space-themed animation',
        price: 200,
        category: 'Profile Effects',
        image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHwxfHxjb3NtaWMlMjBwYXJ0aWNsZXN8ZW58MHx8fHwxNzExMzYyNDAwfDA&ixlib=rb-4.0.3&q=80&w=1080'
    },
    {
        id: 'background-1',
        name: 'Synthwave Cityscape',
        description: 'Retro-futuristic background animation',
        price: 250,
        category: 'Backgrounds',
        image: 'https://i.redd.it/yxuve5xdpmq91.jpg'
    }
];

export function initializeStore() {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth || !db) {
        console.error("Firebase authentication or Firestore not initialized");
        return;
    }

    const storeGrid = document.getElementById('storeGrid');
    const storeSearch = document.getElementById('storeSearch');
    const closeStoreBtn = document.getElementById('closeStoreBtn');
    const storePanel = document.getElementById('storePanel');
    const storeSidebar = document.querySelector('.store-categories');

    // Generate categories dynamically
    const categories = ['All', ...new Set(STORE_ITEMS.map(item => item.category))];
    storeSidebar.innerHTML = categories.map(category => 
        `<li data-category="${category}">${category}</li>`
    ).join('');

    // Set initial active category
    const categoryItems = storeSidebar.querySelectorAll('li');
    categoryItems[0].classList.add('active');

    // Category selection functionality
    categoryItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active from all
            categoryItems.forEach(el => el.classList.remove('active'));
            item.classList.add('active');

            const selectedCategory = item.getAttribute('data-category');
            filterItems(selectedCategory);
        });
    });

    // Close store functionality
    closeStoreBtn.addEventListener('click', () => {
        storePanel.style.opacity = '0';
        storePanel.style.pointerEvents = 'none';
        document.getElementById('storePanelOverlay').style.display = 'none';
    });

    // Filter items function
    function filterItems(category) {
        const filteredItems = category === 'All' 
            ? STORE_ITEMS 
            : STORE_ITEMS.filter(item => item.category === category);
        generateStoreItems(filteredItems);
        attachPurchaseListeners();
    }

    // Dynamically generate store items
    function generateStoreItems(items) {
        storeGrid.innerHTML = ''; // Clear existing items
        items.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('store-card');
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="store-card-content">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                </div>
                <div class="store-card-footer">
                    <span class="price">${item.price} Coins</span>
                    <button class="purchase-btn" data-item-id="${item.id}">Buy</button>
                </div>
            `;
            storeGrid.appendChild(card);
        });
    }

    // Search functionality
    storeSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const activeCategory = document.querySelector('.store-categories li.active').getAttribute('data-category');
        
        const filteredItems = (activeCategory === 'All' ? STORE_ITEMS : STORE_ITEMS.filter(item => item.category === activeCategory))
            .filter(item => 
                item.name.toLowerCase().includes(searchTerm) || 
                item.description.toLowerCase().includes(searchTerm)
            );
        
        generateStoreItems(filteredItems);
        attachPurchaseListeners();
    });

    // Initial generation of store items
    generateStoreItems(STORE_ITEMS);

    async function attachPurchaseListeners() {
        const purchaseButtons = document.querySelectorAll('.purchase-btn');
        
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);
                const coinsElement = document.getElementById('coins');
                const coinsStoreElement = document.getElementById('store-coins');
    
                purchaseButtons.forEach(button => {
                    button.addEventListener('click', async () => {
                        const itemId = button.getAttribute('data-item-id');
                        const item = STORE_ITEMS.find(i => i.id === itemId);
    
                        if (!item) {
                            console.error('Item not found');
                            return;
                        }
    
                        try {
                            // Fetch current user data
                            const userDoc = await userRef.get();
                            const userData = userDoc.data();
                            const currentCoins = userData.coins || 0;
                            const inventory = userData.inventory || [];
    
                            // Check if item is already in inventory
                            if (inventory.some(invItem => invItem.id === item.id)) {
                                alert('You already own this item!');
                                return;
                            }
    
                            // Check if user has enough coins
                            if (currentCoins < item.price) {
                                alert(`Not enough coins! You need ${item.price} coins to purchase this item.`);
                                return;
                            }
    
                            // Deduct coins and add item to inventory
                            const newCoinBalance = currentCoins - item.price;
                            const newInventory = [...inventory, {
                                id: item.id,
                                name: item.name,
                                purchaseDate: new Date().toISOString()
                            }];
    
                            // Update Firestore
                            await userRef.update({
                                coins: newCoinBalance,
                                inventory: newInventory
                            });
    
                            // Disable purchase button and update UI
                            button.disabled = true;
                            button.textContent = 'Purchased';
    
                            // Update coins display
                            const coinSpan = coinsElement.querySelector('span');
                            coinSpan.textContent = formatCoins(newCoinBalance);
                            coinSpan.setAttribute('title', newCoinBalance.toLocaleString() + ' coins');
    
                            // Update store coins display
                            const storeCoinsSpan = coinsStoreElement.querySelector('span');
                            storeCoinsSpan.textContent = formatCoins(newCoinBalance);
                            storeCoinsSpan.setAttribute('title', newCoinBalance.toLocaleString() + ' coins');
    
                            // Optional: Show purchase confirmation
                            alert(`Successfully purchased ${item.name}!`);
    
                        } catch (error) {
                            console.error('Purchase error:', error);
                            alert('An error occurred during purchase. Please try again.');
                        }
                    });
                });
    
                // Disable already owned items
                const userDoc = await userRef.get();
                const userData = userDoc.data();
                const inventory = userData.inventory || [];
    
                purchaseButtons.forEach(button => {
                    const itemId = button.getAttribute('data-item-id');
                    if (inventory.some(invItem => invItem.id === itemId)) {
                        button.disabled = true;
                        button.textContent = 'Purchased';
                    }
                });
            }
        });
    }

    // Attach purchase listeners initially
    attachPurchaseListeners();
}

// Initialize store when DOM is loaded
export function initStoreOnLoad() {
    window.addEventListener('DOMContentLoaded', initializeStore);
}
