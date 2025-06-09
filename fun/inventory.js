// inventory.js
import { getAuth, getFirestore } from '../firebase/firebase-config.js';
import STORE_ITEMS from './store-items.js';
import { ProfileEffectManager, handleProfileEffects } from './profile-effects/profile-effects-manager.js';

const profileEffectManager = new ProfileEffectManager();

export function initializeInventory() {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth || !db) {
        console.error("Firebase authentication or Firestore not initialized");
        return;
    }

    const inventoryPanel = document.getElementById('inventoryPanel');
    const inventoryGrid = document.getElementById('inventoryGrid');
    const inventorySearch = document.getElementById('inventorySearch');
    const closeInventoryBtn = document.getElementById('closeInventoryBtn');
    const inventorySidebar = document.querySelector('.inventory-categories') || createInventorySidebar();
    const inventoryPanelOverlay = document.getElementById('inventoryPanelOverlay') || createInventoryOverlay();

    // Create sidebar if it doesn't exist
    function createInventorySidebar() {
        const sidebar = document.createElement('ul');
        sidebar.classList.add('inventory-categories');
        inventoryPanel.insertBefore(sidebar, inventoryGrid);
        return sidebar;
    }

    // Create overlay if it doesn't exist
    function createInventoryOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'inventoryPanelOverlay';
        overlay.classList.add('inventory-panel-overlay');
        document.body.appendChild(overlay);
        return overlay;
    }

    // Close inventory functionality
    closeInventoryBtn.addEventListener('click', () => {
        inventoryPanel.style.opacity = '0';
        inventoryPanel.style.pointerEvents = 'none';
        inventoryPanelOverlay.style.display = 'none';
    });

    // Generate categories dynamically
    function generateCategories(inventory) {
        // Extract unique categories from the user's inventory
        const categories = ['All', ...new Set(
            inventory
                .map(invItem => {
                    const storeItem = STORE_ITEMS.find(item => item.id === invItem.id);
                    return storeItem ? storeItem.category : null;
                })
                .filter(category => category !== null)
        )];

        // Populate sidebar
        inventorySidebar.innerHTML = categories.map(category =>
            `<li data-category="${category}">${category}</li>`
        ).join('');

        // Set initial active category
        const categoryItems = inventorySidebar.querySelectorAll('li');
        if (categoryItems.length > 0) {
            categoryItems[0].classList.add('active');
        }

        // Category selection functionality
        categoryItems.forEach(item => {
            item.addEventListener('click', () => {
                // Remove active from all
                categoryItems.forEach(el => el.classList.remove('active'));
                item.classList.add('active');

                const selectedCategory = item.getAttribute('data-category');
                filterInventoryItems(selectedCategory);
            });
        });
    }

    // Filter inventory items
    function filterInventoryItems(category) {
        const inventoryCards = document.querySelectorAll('.inventory-card');
        
        inventoryCards.forEach(card => {
            const itemCategory = card.getAttribute('data-category');
            
            if (category === 'All' || itemCategory === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Search functionality
    inventorySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const inventoryCards = document.querySelectorAll('.inventory-card');
        const activeCategory = document.querySelector('.inventory-categories li.active')?.getAttribute('data-category') || 'All';
        
        inventoryCards.forEach(card => {
            const itemName = card.querySelector('h3').textContent.toLowerCase();
            const itemDescription = card.querySelector('p').textContent.toLowerCase();
            const itemCategory = card.getAttribute('data-category');
            
            const matchesSearch = itemName.includes(searchTerm) || itemDescription.includes(searchTerm);
            const matchesCategory = activeCategory === 'All' || itemCategory === activeCategory;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // Generate inventory items
    function generateInventoryItems(inventory) {
        inventoryGrid.innerHTML = ''; // Clear existing items
        
        inventory.forEach(inventoryItem => {
            // Find the corresponding store item
            const storeItem = STORE_ITEMS.find(item => item.id === inventoryItem.id);
            
            if (storeItem) {
                const card = document.createElement('div');
                card.classList.add('inventory-card');
                card.setAttribute('data-category', storeItem.category);
                card.innerHTML = `
                    <img src="${storeItem.image}" alt="${storeItem.name}">
                    <div class="inventory-card-content">
                        <h3>${storeItem.name}</h3>
                        <p>${storeItem.description}</p>
                        <div class="inventory-toggle">
                            <label>Enabled</label>
                            <label class="toggle-switch">
                                <input type="checkbox" 
                                       data-item-id="${storeItem.id}"
                                       ${inventoryItem.enabled ? 'checked' : ''}>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                `;
                inventoryGrid.appendChild(card);
            }
        });
    }

    // Attach inventory listeners
    function attachInventoryListeners() {
        auth.onAuthStateChanged((user) => {
            if (user) {
                const userRef = db.collection("users").doc(user.uid);

                const unsubscribe = userRef.onSnapshot((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        const inventory = userData.inventory || [];

                        // Generate categories first
                        generateCategories(inventory);

                        // Generate inventory items
                        generateInventoryItems(inventory);

                        // Handle profile effects
                        const profilePanel = document.getElementById('profilePanel');
                        if (profilePanel) {
                            handleProfileEffects(inventory, profilePanel, profileEffectManager);
                        }

                        // Attach toggle listeners (remove old ones first to prevent duplicates)
                        const toggleSwitches = document.querySelectorAll('.inventory-toggle input');
                        toggleSwitches.forEach(toggle => {
                            // Remove existing event listeners by cloning the element
                            const newToggle = toggle.cloneNode(true);
                            toggle.parentNode.replaceChild(newToggle, toggle);
                            
                            newToggle.addEventListener('change', async (e) => {
                                const itemId = e.target.getAttribute('data-item-id');
                                const isEnabled = e.target.checked;

                                // Update the specific item's enabled status in the inventory
                                const updatedInventory = inventory.map(item => 
                                    item.id === itemId 
                                        ? {...item, enabled: isEnabled} 
                                        : item
                                );

                                // Update Firestore with the new inventory state
                                try {
                                    await userRef.update({
                                        inventory: updatedInventory
                                    });

                                    // Handle profile effects after inventory update
                                    const profilePanel = document.getElementById('profilePanel');
                                    if (profilePanel) {
                                        handleProfileEffects(updatedInventory, profilePanel, profileEffectManager);
                                    }

                                } catch (error) {
                                    console.error('Error updating item status:', error);
                                    // Revert toggle if update fails
                                    e.target.checked = !isEnabled;
                                }
                            });
                        });
                    }
                }, (error) => {
                    console.error('Error listening to inventory changes:', error);
                });

                return unsubscribe;
            }
        });
    }

    // Initialize inventory listeners
    const unsubscribe = attachInventoryListeners();

    // Return cleanup function
    return () => {
        if (typeof unsubscribe === 'function') {
            unsubscribe();
        }
        // Clean up all effects when component unmounts
        if (profileEffectManager && profileEffectManager.activeEffects) {
            profileEffectManager.activeEffects.forEach(effect => effect.destroy());
        }
    };
}

// Initialize inventory when DOM is loaded
export function initInventoryOnLoad() {
    window.addEventListener('DOMContentLoaded', initializeInventory);
}
