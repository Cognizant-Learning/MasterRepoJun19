// Translations for multiple languages

const translations = {
    en: {
        // Dashboard
        totalItems: "Total Unique Items",
        lowStockItems: "Items Low on Stock",
        outOfStockItems: "Items Out of Stock",
        inventoryByCategory: "Inventory by Category",
        stockStatus: "Stock Status",
        
        // Table Headers
        name: "Name",
        sku: "SKU",
        category: "Category",
        price: "Price",
        quantity: "Quantity",
        actions: "Actions",
        
        // Buttons & Search
        addNewItem: "Add New Item",
        searchPlaceholder: "Search inventory...",
        
        // Modal Titles & Buttons
        addItem: "Add New Item",
        editItem: "Edit Item",
        confirmDelete: "Confirm Delete",
        cancel: "Cancel",
        save: "Save Item",
        update: "Update Item",
        delete: "Delete",
        
        // Form Labels
        itemName: "Name",
        itemSku: "SKU",
        itemCategory: "Category",
        itemPrice: "Price",
        itemQuantity: "Quantity",
          // Messages
        deleteConfirmation: "Are you sure you want to delete this item? This action cannot be undone.",
        noItemsFound: "No items found",
        
        // Accessibility Messages
        itemAdded: "Item has been added successfully.",
        itemUpdated: "Item has been updated successfully.",
        itemDeleted: "Item has been deleted successfully.",
        loadingData: "Loading data, please wait.",
        searchResults: "Search results: {0} items found.",
        sortedBy: "Table sorted by {0} in {1} order.",
        formError: "Please fix the errors in the form.",
        requiredField: "{0} is a required field."
    },
    es: {
        // Dashboard
        totalItems: "Total de Artículos Únicos",
        lowStockItems: "Artículos con Poco Stock",
        outOfStockItems: "Artículos Sin Stock",
        inventoryByCategory: "Inventario por Categoría",
        stockStatus: "Estado del Stock",
        
        // Table Headers
        name: "Nombre",
        sku: "SKU",
        category: "Categoría",
        price: "Precio",
        quantity: "Cantidad",
        actions: "Acciones",
        
        // Buttons & Search
        addNewItem: "Añadir Nuevo Artículo",
        searchPlaceholder: "Buscar inventario...",
        
        // Modal Titles & Buttons
        addItem: "Añadir Nuevo Artículo",
        editItem: "Editar Artículo",
        confirmDelete: "Confirmar Eliminación",
        cancel: "Cancelar",
        save: "Guardar Artículo",
        update: "Actualizar Artículo",
        delete: "Eliminar",
        
        // Form Labels
        itemName: "Nombre",
        itemSku: "SKU",
        itemCategory: "Categoría",
        itemPrice: "Precio",
        itemQuantity: "Cantidad",
        
        // Messages
        deleteConfirmation: "¿Estás seguro de que quieres eliminar este artículo? Esta acción no se puede deshacer.",
        noItemsFound: "No se encontraron artículos"
    },
    fr: {
        // Dashboard
        totalItems: "Total Articles Uniques",
        lowStockItems: "Articles en Stock Faible",
        outOfStockItems: "Articles en Rupture de Stock",
        inventoryByCategory: "Inventaire par Catégorie",
        stockStatus: "État du Stock",
        
        // Table Headers
        name: "Nom",
        sku: "UGS",
        category: "Catégorie",
        price: "Prix",
        quantity: "Quantité",
        actions: "Actions",
        
        // Buttons & Search
        addNewItem: "Ajouter un Nouvel Article",
        searchPlaceholder: "Rechercher dans l'inventaire...",
        
        // Modal Titles & Buttons
        addItem: "Ajouter un Nouvel Article",
        editItem: "Modifier l'Article",
        confirmDelete: "Confirmer la Suppression",
        cancel: "Annuler",
        save: "Enregistrer l'Article",
        update: "Mettre à Jour l'Article",
        delete: "Supprimer",
        
        // Form Labels
        itemName: "Nom",
        itemSku: "UGS",
        itemCategory: "Catégorie",
        itemPrice: "Prix",
        itemQuantity: "Quantité",
        
        // Messages
        deleteConfirmation: "Êtes-vous sûr de vouloir supprimer cet article? Cette action ne peut pas être annulée.",
        noItemsFound: "Aucun article trouvé"
    },
    de: {
        // Dashboard
        totalItems: "Gesamtzahl Einzigartiger Artikel",
        lowStockItems: "Artikel mit Geringem Bestand",
        outOfStockItems: "Nicht Verfügbare Artikel",
        inventoryByCategory: "Bestand nach Kategorie",
        stockStatus: "Bestandsstatus",
        
        // Table Headers
        name: "Name",
        sku: "SKU",
        category: "Kategorie",
        price: "Preis",
        quantity: "Menge",
        actions: "Aktionen",
        
        // Buttons & Search
        addNewItem: "Neuen Artikel Hinzufügen",
        searchPlaceholder: "Bestand durchsuchen...",
        
        // Modal Titles & Buttons
        addItem: "Neuen Artikel Hinzufügen",
        editItem: "Artikel Bearbeiten",
        confirmDelete: "Löschen Bestätigen",
        cancel: "Abbrechen",
        save: "Artikel Speichern",
        update: "Artikel Aktualisieren",
        delete: "Löschen",
        
        // Form Labels
        itemName: "Name",
        itemSku: "SKU",
        itemCategory: "Kategorie",
        itemPrice: "Preis",
        itemQuantity: "Menge",
        
        // Messages
        deleteConfirmation: "Sind Sie sicher, dass Sie diesen Artikel löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
        noItemsFound: "Keine Artikel gefunden"
    }
};

// Theme & Language Management Class
class UIManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('preferredLanguage') || 'en';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        
        // Initialize theme and language
        this.initTheme();
        this.initLanguage();
        
        // Add event listeners
        this.setupEventListeners();
    }
    
    initTheme() {
        const darkModeCss = document.getElementById('theme-css');
        const themeToggle = document.getElementById('themeToggle');
        
        if (this.darkMode) {
            document.body.classList.add('dark-mode');
            darkModeCss.removeAttribute('disabled');
            themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            darkModeCss.setAttribute('disabled', 'true');
            themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
        }
    }
    
    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.initTheme();
    }
    
    initLanguage() {
        this.translate(this.currentLanguage);
    }
    
    translate(language) {
        if (!translations[language]) {
            console.error(`Language '${language}' not supported.`);
            return;
        }
        
        this.currentLanguage = language;
        localStorage.setItem('preferredLanguage', language);
        
        // Update all translatable elements
        document.querySelectorAll('.translatable').forEach(element => {
            const key = element.dataset.key;
            if (key && translations[language][key]) {
                element.textContent = translations[language][key];
            }
        });
        
        // Update placeholder attributes
        document.querySelectorAll('input[data-key], textarea[data-key]').forEach(element => {
            const key = element.dataset.key;
            if (key && translations[language][key]) {
                element.placeholder = translations[language][key];
            }
        });
        
        // Update modal content
        this.updateModalContent(language);
    }
    
    updateModalContent(language) {
        // Add Item Modal
        document.getElementById('addItemModalLabel').textContent = translations[language].addItem || 'Add New Item';
        document.getElementById('saveItemBtn').textContent = translations[language].save || 'Save Item';
        
        // Edit Item Modal
        document.getElementById('editItemModalLabel').textContent = translations[language].editItem || 'Edit Item';
        document.getElementById('updateItemBtn').textContent = translations[language].update || 'Update Item';
        
        // Delete Confirmation Modal
        document.getElementById('deleteConfirmModalLabel').textContent = translations[language].confirmDelete || 'Confirm Delete';
        document.getElementById('confirmDeleteBtn').textContent = translations[language].delete || 'Delete';
        
        // Update form labels
        const formLabels = [
            { id: 'itemName', key: 'itemName' },
            { id: 'itemSku', key: 'itemSku' },
            { id: 'itemCategory', key: 'itemCategory' },
            { id: 'itemPrice', key: 'itemPrice' },
            { id: 'itemQuantity', key: 'itemQuantity' },
            { id: 'editItemName', key: 'itemName' },
            { id: 'editItemSku', key: 'itemSku' },
            { id: 'editItemCategory', key: 'itemCategory' },
            { id: 'editItemPrice', key: 'itemPrice' },
            { id: 'editItemQuantity', key: 'itemQuantity' }
        ];
        
        formLabels.forEach(item => {
            const label = document.querySelector(`label[for="${item.id}"]`);
            if (label) {
                label.textContent = translations[language][item.key] || item.key;
            }
        });
        
        // Update delete confirmation message
        const deleteMsg = document.querySelector('#deleteConfirmModal .modal-body p');
        if (deleteMsg) {
            deleteMsg.textContent = translations[language].deleteConfirmation || 'Are you sure you want to delete this item? This action cannot be undone.';
        }
    }
    
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Language selection
        document.querySelectorAll('.language-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const language = e.target.dataset.lang;
                this.translate(language);
            });
        });
    }
}

// Initialize the UI Manager
let uiManager;
document.addEventListener('DOMContentLoaded', () => {
    uiManager = new UIManager();
});
