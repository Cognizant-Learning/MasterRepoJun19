// Main application logic for the Inventory Dashboard

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the inventory API and make it globally available for other modules
    const api = new InventoryAPI();
    window.inventoryApi = api;
    
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
        
        // Refresh charts if they're initialized
        if (window.dashboardCharts && typeof window.dashboardCharts.refreshCharts === 'function') {
            window.dashboardCharts.refreshCharts();
        }
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
            row.setAttribute('role', 'row');
            row.innerHTML = '<td colspan="6" class="text-center">No items found</td>';
            inventoryTable.appendChild(row);
            
            // Announce to screen readers
            if (window.accessibilityHelper) {
                accessibilityHelper.announce('No items found in inventory');
            }
            return;
        }
        
        items.forEach(item => {
            const row = document.createElement('tr');
            row.setAttribute('role', 'row');
            
            // Apply low stock or out of stock highlighting
            if (item.quantity === 0) {
                row.classList.add('out-of-stock');
                row.setAttribute('aria-description', 'This item is out of stock');
            } else if (item.quantity < CONFIG.LOW_STOCK_THRESHOLD) {
                row.classList.add('low-stock');
                row.setAttribute('aria-description', 'This item is low on stock');
            }
            
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.sku}</td>
                <td>${item.category}</td>
                <td aria-label="Price: $${item.price.toFixed(2)}">$${item.price.toFixed(2)}</td>
                <td aria-label="Quantity: ${item.quantity}">${item.quantity}</td>
                <td>
                    <button class="btn btn-sm btn-primary action-btn edit-btn" data-id="${item.id}" aria-label="Edit ${item.name}">
                        <i class="bi bi-pencil-fill" aria-hidden="true"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger action-btn delete-btn" data-id="${item.id}" aria-label="Delete ${item.name}">
                        <i class="bi bi-trash-fill" aria-hidden="true"></i> Delete
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
        
        // Announce updates to screen readers
        if (window.accessibilityHelper) {
            accessibilityHelper.announce(`${items.length} inventory items displayed`);
        }
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
        
        // Update the aria-sort attributes of table headers
        document.querySelectorAll('th[data-sort]').forEach(th => {
            if (th.dataset.sort === sortKey) {
                th.setAttribute('aria-sort', sortAscending ? 'ascending' : 'descending');
            } else {
                th.setAttribute('aria-sort', 'none');
            }
        });
        
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
                
                // Announce the sort change to screen readers
                if (window.accessibilityHelper) {
                    // Get the header text for the column
                    const headerText = document.querySelector(`th[data-sort="${sortKey}"]`)?.textContent.trim() || sortKey;
                    accessibilityHelper.updateSortHeaderStatus(sortKey, sortAscending);
                }
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
        
        // Validate and show accessible error messages
        const form = document.getElementById('addItemForm');
        if (!validateForm(form)) {
            // Set focus to the first invalid field
            form.querySelector(':invalid')?.focus();
            return;
        }
        
        // Show loading state
        if (window.accessibilityHelper) {
            accessibilityHelper.announce('Adding new item. Please wait...', 'assertive');
        }
        
        const response = await api.createItem(newItem);
        
        if (response.success) {
            // Clear form
            form.reset();
            
            // Hide modal
            addItemModal.hide();
            
            // Announce success to screen readers
            if (window.accessibilityHelper) {
                accessibilityHelper.announceCrudOperation('create', newItem.name);
            }
            
            // Reload dashboard
            loadDashboard();
        } else {
            // Announce failure to screen readers
            if (window.accessibilityHelper) {
                accessibilityHelper.announce('Failed to add item. ' + (response.error || ''), 'assertive');
            } else {
                alert('Failed to add item');
            }
            console.error(response.error);
        }
    }
    
    // Validate form and show accessible error messages
    function validateForm(form) {
        let isValid = true;
        const invalidFields = [];
        
        // Check each required input
        form.querySelectorAll('[required]').forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
                
                // Get the field name from the label
                const fieldName = document.querySelector(`label[for="${input.id}"]`)?.textContent || input.id;
                invalidFields.push(fieldName);
                
                // Add error message for screen readers
                const helpId = input.getAttribute('aria-describedby');
                const helpElement = helpId ? document.getElementById(helpId) : null;
                
                if (helpElement) {
                    helpElement.classList.add('text-danger');
                    helpElement.textContent = `${fieldName} is required`;
                }
                
                // Add event listener to remove error state when value changes
                input.addEventListener('input', function() {
                    if (this.value.trim()) {
                        this.classList.remove('is-invalid');
                        if (helpElement) {
                            helpElement.classList.remove('text-danger');
                            helpElement.textContent = helpElement.getAttribute('data-original-text') || '';
                        }
                    }
                }, { once: true });
            }
        });
        
        // Announce invalid fields to screen readers
        if (!isValid && window.accessibilityHelper) {
            accessibilityHelper.announce(
                `Please complete the following required fields: ${invalidFields.join(', ')}`,
                'assertive'
            );
        }
        
        return isValid;
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
            if (window.accessibilityHelper) {
                accessibilityHelper.announce('Please fill in all fields with valid values', 'assertive');
            } else {
                alert('Please fill in all fields with valid values');
            }
            return;
        }
        
        // Show loading state
        if (window.accessibilityHelper) {
            accessibilityHelper.announce('Updating item. Please wait...', 'polite');
        }
        
        const response = await api.updateItem(itemId, updatedItem);
        
        if (response.success) {
            // Hide modal
            editItemModalBS.hide();
            
            // Announce success
            if (window.accessibilityHelper) {
                accessibilityHelper.announceCrudOperation('update', updatedItem.name);
            }
            
            // Reload dashboard
            loadDashboard();
        } else {
            if (window.accessibilityHelper) {
                accessibilityHelper.announce('Failed to update item. ' + (response.error || ''), 'assertive');
            } else {
                alert('Failed to update item');
            }
            console.error(response.error);
        }
    }
      // Open delete confirmation modal
    function openDeleteConfirmation(itemId) {
        deleteItemIdInput.value = itemId;
        
        // Get item name for better accessibility
        api.getAllItems().then(response => {
            if (response.success) {
                const item = response.data.find(item => item.id === itemId);
                if (item) {
                    const nameElement = document.getElementById('itemToDeleteName');
                    if (nameElement) {
                        nameElement.textContent = item.name;
                    }
                    if (window.accessibilityHelper) {
                        accessibilityHelper.announce(`Confirm deletion of ${item.name}`, 'polite');
                    }
                }
            }
        });
        
        deleteConfirmModalBS.show();
    }
    
    // Delete an inventory item
    async function deleteItem() {
        const itemId = deleteItemIdInput.value;
        let itemName = document.getElementById('itemToDeleteName')?.textContent || 'item';
        
        // Show loading state
        if (window.accessibilityHelper) {
            accessibilityHelper.announce('Deleting item. Please wait...', 'polite');
        }
        
        const response = await api.deleteItem(itemId);
        
        if (response.success) {
            // Hide modal
            deleteConfirmModalBS.hide();
            
            // Announce success
            if (window.accessibilityHelper) {
                accessibilityHelper.announceCrudOperation('delete', itemName);
            }
            
            // Reload dashboard
            loadDashboard();
        } else {
            if (window.accessibilityHelper) {
                accessibilityHelper.announce('Failed to delete item. ' + (response.error || ''), 'assertive');
            } else {
                alert('Failed to delete item');
            }
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
