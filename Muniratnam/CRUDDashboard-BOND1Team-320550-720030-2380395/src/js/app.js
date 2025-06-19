// Main application logic for the Inventory Dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the inventory API
    const api = new InventoryAPI();
    
    // DOM elements
    const inventoryTable = document.getElementById('inventoryTableBody');
    const searchInput = document.getElementById('searchInput');
    const totalItemsElement = document.getElementById('totalItems');
    const lowStockItemsElement = document.getElementById('lowStockItems');
    const outOfStockItemsElement = document.getElementById('outOfStockItems');
    
    // DOM elements for add item modal
    const saveItemBtn = document.getElementById('saveItemBtn');
    const itemNameInput = document.getElementById('itemName');
    const itemSkuInput = document.getElementById('itemSku');
    const itemCategoryInput = document.getElementById('itemCategory');
    const itemPriceInput = document.getElementById('itemPrice');
    const itemQuantityInput = document.getElementById('itemQuantity');
    
    // DOM elements for edit item modal
    const editItemModal = document.getElementById('editItemModal');
    const editItemIdInput = document.getElementById('editItemId');
    const editItemNameInput = document.getElementById('editItemName');
    const editItemSkuInput = document.getElementById('editItemSku');
    const editItemCategoryInput = document.getElementById('editItemCategory');
    const editItemPriceInput = document.getElementById('editItemPrice');
    const editItemQuantityInput = document.getElementById('editItemQuantity');
    const updateItemBtn = document.getElementById('updateItemBtn');
    
    // DOM elements for delete confirmation modal
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const deleteItemIdInput = document.getElementById('deleteItemId');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    
    // Load data and initialize the dashboard
    loadDashboard();
    
    // Event listeners for sorting
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const sortKey = th.dataset.sort;
            sortInventory(sortKey);
        });
    });
    
    // Event listener for search
    searchInput.addEventListener('input', filterInventory);
    
    // Event listener for add item form
    saveItemBtn.addEventListener('click', addNewItem);
    
    // Event listener for update item form
    updateItemBtn.addEventListener('click', updateItem);
    
    // Event listener for delete confirmation
    confirmDeleteBtn.addEventListener('click', deleteItem);
    
    // Initialize Bootstrap modals
    const addItemModal = new bootstrap.Modal(document.getElementById('addItemModal'));
    const editItemModalBS = new bootstrap.Modal(editItemModal);
    const deleteConfirmModalBS = new bootstrap.Modal(deleteConfirmModal);
    
    // Load dashboard data
    async function loadDashboard() {
        await loadInventoryItems();
        await updateDashboardStats();
    }
    
    // Load inventory items
    async function loadInventoryItems() {
        const response = await api.getAllItems();
        
        if (response.success) {
            renderInventoryTable(response.data);
        } else {
            alert('Failed to load inventory items');
            console.error(response.error);
        }
    }
    
    // Update dashboard stats
    async function updateDashboardStats() {
        const response = await api.getStats();
        
        if (response.success) {
            totalItemsElement.textContent = response.data.totalItems;
            lowStockItemsElement.textContent = response.data.lowStockItems;
            outOfStockItemsElement.textContent = response.data.outOfStockItems;
        } else {
            console.error('Failed to update dashboard stats:', response.error);
        }
    }
    
    // Render inventory table
    function renderInventoryTable(items) {
        inventoryTable.innerHTML = '';
        
        if (items.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" class="text-center">No items found</td>';
            inventoryTable.appendChild(row);
            return;
        }
        
        items.forEach(item => {
            const row = document.createElement('tr');
            
            // Apply low stock or out of stock highlighting
            if (item.quantity === 0) {
                row.classList.add('out-of-stock');
            } else if (item.quantity < CONFIG.LOW_STOCK_THRESHOLD) {
                row.classList.add('low-stock');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.sku}</td>
                <td>${item.category}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-primary action-btn edit-btn" data-id="${item.id}">
                        <i class="bi bi-pencil-fill"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger action-btn delete-btn" data-id="${item.id}">
                        <i class="bi bi-trash-fill"></i> Delete
                    </button>
                </td>
            `;
            
            inventoryTable.appendChild(row);
        });
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => openEditModal(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => openDeleteConfirmation(btn.dataset.id));
        });
    }
    
    // Filter inventory based on search input
    function filterInventory() {
        const searchTerm = searchInput.value.toLowerCase();
        
        api.getAllItems().then(response => {
            if (response.success) {
                const filteredItems = response.data.filter(item => {
                    return (
                        item.name.toLowerCase().includes(searchTerm) ||
                        item.sku.toLowerCase().includes(searchTerm) ||
                        item.category.toLowerCase().includes(searchTerm) ||
                        item.price.toString().includes(searchTerm) ||
                        item.quantity.toString().includes(searchTerm)
                    );
                });
                
                renderInventoryTable(filteredItems);
            }
        });
    }
    
    // Sort inventory by column
    let currentSortKey = null;
    let sortAscending = true;
    
    function sortInventory(sortKey) {
        if (currentSortKey === sortKey) {
            sortAscending = !sortAscending;
        } else {
            currentSortKey = sortKey;
            sortAscending = true;
        }
        
        api.getAllItems().then(response => {
            if (response.success) {
                const sortedItems = [...response.data].sort((a, b) => {
                    let valueA = a[sortKey];
                    let valueB = b[sortKey];
                    
                    if (typeof valueA === 'string') {
                        valueA = valueA.toLowerCase();
                        valueB = valueB.toLowerCase();
                    }
                    
                    if (valueA < valueB) return sortAscending ? -1 : 1;
                    if (valueA > valueB) return sortAscending ? 1 : -1;
                    return 0;
                });
                
                renderInventoryTable(sortedItems);
            }
        });
    }
    
    // Add a new inventory item
    async function addNewItem() {
        const newItem = {
            name: itemNameInput.value.trim(),
            sku: itemSkuInput.value.trim(),
            category: itemCategoryInput.value.trim(),
            price: itemPriceInput.value,
            quantity: itemQuantityInput.value
        };
        
        // Simple validation
        if (!newItem.name || !newItem.sku || !newItem.category || !newItem.price || !newItem.quantity) {
            alert('Please fill in all fields');
            return;
        }
        
        const response = await api.createItem(newItem);
        
        if (response.success) {
            // Clear form
            document.getElementById('addItemForm').reset();
            
            // Hide modal
            addItemModal.hide();
            
            // Reload dashboard
            loadDashboard();
        } else {
            alert('Failed to add item');
            console.error(response.error);
        }
    }
    
    // Open edit modal with item data
    async function openEditModal(itemId) {
        const response = await api.getAllItems();
        
        if (response.success) {
            const item = response.data.find(item => item.id === itemId);
            
            if (item) {
                editItemIdInput.value = item.id;
                editItemNameInput.value = item.name;
                editItemSkuInput.value = item.sku;
                editItemCategoryInput.value = item.category;
                editItemPriceInput.value = item.price;
                editItemQuantityInput.value = item.quantity;
                
                editItemModalBS.show();
            } else {
                alert('Item not found');
            }
        } else {
            alert('Failed to fetch item');
            console.error(response.error);
        }
    }
    
    // Update an inventory item
    async function updateItem() {
        const itemId = editItemIdInput.value;
        const updatedItem = {
            name: editItemNameInput.value.trim(),
            sku: editItemSkuInput.value.trim(),
            category: editItemCategoryInput.value.trim(),
            price: parseFloat(editItemPriceInput.value),
            quantity: parseInt(editItemQuantityInput.value)
        };
        
        // Simple validation
        if (!updatedItem.name || !updatedItem.sku || !updatedItem.category || isNaN(updatedItem.price) || isNaN(updatedItem.quantity)) {
            alert('Please fill in all fields with valid values');
            return;
        }
        
        const response = await api.updateItem(itemId, updatedItem);
        
        if (response.success) {
            // Hide modal
            editItemModalBS.hide();
            
            // Reload dashboard
            loadDashboard();
        } else {
            alert('Failed to update item');
            console.error(response.error);
        }
    }
    
    // Open delete confirmation modal
    function openDeleteConfirmation(itemId) {
        deleteItemIdInput.value = itemId;
        deleteConfirmModalBS.show();
    }
    
    // Delete an inventory item
    async function deleteItem() {
        const itemId = deleteItemIdInput.value;
        
        const response = await api.deleteItem(itemId);
        
        if (response.success) {
            // Hide modal
            deleteConfirmModalBS.hide();
            
            // Reload dashboard
            loadDashboard();
        } else {
            alert('Failed to delete item');
            console.error(response.error);
        }
    }
    
    // Add some sample data for demonstration if the inventory is empty
    async function addSampleData() {
        const response = await api.getAllItems();
        
        if (response.success && response.data.length === 0) {
            const sampleItems = [
                {
                    name: "Office Chair",
                    sku: "FRN-1001",
                    category: "Furniture",
                    price: 199.99,
                    quantity: 15
                },
                {
                    name: "Premium Desk",
                    sku: "FRN-2002",
                    category: "Furniture",
                    price: 349.99,
                    quantity: 8
                },
                {
                    name: "Wireless Mouse",
                    sku: "ELC-3001",
                    category: "Electronics",
                    price: 24.99,
                    quantity: 30
                },
                {
                    name: "Mechanical Keyboard",
                    sku: "ELC-3002",
                    category: "Electronics",
                    price: 89.99,
                    quantity: 5
                },
                {
                    name: "Monitor Stand",
                    sku: "ACC-4001",
                    category: "Accessories",
                    price: 49.99,
                    quantity: 0
                }
            ];
            
            for (const item of sampleItems) {
                await api.createItem(item);
            }
            
            loadDashboard();
        }
    }
    
    // Load sample data for demonstration
    addSampleData();
});
