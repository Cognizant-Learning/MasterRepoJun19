import { useState, useEffect, useMemo } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Checkbox,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Box,
  TableSortLabel,
  Modal,
  TextField
} from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { InventoryItem } from '../../types/InventoryItem';
import { SearchFilter } from './SearchFilter';
import './Dashboard.scss';
import { v4 as uuidv4 } from 'uuid';

const API_BASE_URL = 'http://localhost:5000/api/inventory';

export const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState<keyof InventoryItem>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'low' | 'out' | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({ name: '', sku: '', category: '', price: 0, quantity: 0 });

  // Sample data for demonstration
  const sampleData: InventoryItem[] = [
    { id: '1', name: 'Wireless Mouse', sku: 'WM-1001', category: 'Electronics', price: 25.99, quantity: 15 },
    { id: '2', name: 'Bluetooth Keyboard', sku: 'BK-2002', category: 'Electronics', price: 45.5, quantity: 8 },
    { id: '3', name: 'Office Chair', sku: 'OC-3003', category: 'Furniture', price: 120.0, quantity: 0 },
    { id: '4', name: 'Standing Desk', sku: 'SD-4004', category: 'Furniture', price: 350.0, quantity: 3 },
    { id: '5', name: 'Notebook', sku: 'NB-5005', category: 'Stationery', price: 2.5, quantity: 50 },
    { id: '6', name: 'Pen Set', sku: 'PS-6006', category: 'Stationery', price: 5.0, quantity: 10 },
    { id: '7', name: 'Monitor 24"', sku: 'MN-7007', category: 'Electronics', price: 150.0, quantity: 0 },
    { id: '8', name: 'Desk Lamp', sku: 'DL-8008', category: 'Electronics', price: 18.75, quantity: 6 },
    { id: '9', name: 'Filing Cabinet', sku: 'FC-9009', category: 'Furniture', price: 80.0, quantity: 2 },
    { id: '10', name: 'Sticky Notes', sku: 'SN-1010', category: 'Stationery', price: 1.2, quantity: 100 }
  ];

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL);
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
      setItems(sampleData); // Fallback to sample data if API fails
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    let filtered = items;
    if (filterType === 'low') {
      filtered = filtered.filter(item => item.quantity > 0 && item.quantity <= 10);
    } else if (filterType === 'out') {
      filtered = filtered.filter(item => item.quantity === 0);
    }
    const searchLower = searchTerm.toLowerCase();
    return filtered.filter(item =>
      item.name.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower)
    );
  }, [items, searchTerm, filterType]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedItems(items.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleEdit = (id: string) => {
    const item = items.find(i => i.id === id);
    if (item) {
      setEditItem({ ...item });
      setEditModalOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteItemId) return;
    try {
      await axios.delete(`${API_BASE_URL}/${deleteItemId}`);
      setItems(prev => prev.filter(item => item.id !== deleteItemId));
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    } catch (err) {
      console.error('Failed to delete item:', err);
      // You could show an error message to the user here
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setDeleteItemId(null);
  };

  const handleSort = (property: keyof InventoryItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    const sortedItems = [...items].sort((a, b) => {
      const aValue = a[property];
      const bValue = b[property];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return (isAsc ? -1 : 1) * aValue.localeCompare(bValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (isAsc ? -1 : 1) * (aValue - bValue);
      }
      return 0;
    });
    
    setItems(sortedItems);
  };

  const handleAddNew = () => {
    setNewItem({ name: '', sku: '', category: '', price: 0, quantity: 0 });
    setCreateModalOpen(true);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatClick = (type: 'all' | 'low' | 'out') => {
    setFilterType(type);
  };

  const handleEditFieldChange = (field: keyof InventoryItem, value: string | number) => {
    if (!editItem) return;
    setEditItem({ ...editItem, [field]: value });
  };

  const handleEditSave = async () => {
    if (!editItem) return;
    try {
      await axios.put(`${API_BASE_URL}/${editItem.id}`, editItem);
      setItems(prev => prev.map(item => item.id === editItem.id ? editItem : item));
      setEditModalOpen(false);
      setEditItem(null);
    } catch (err) {
      console.error('Failed to update item:', err);
      // You could show an error message to the user here
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditItem(null);
  };

  const handleCreateFieldChange = (field: keyof Omit<InventoryItem, 'id'>, value: string | number) => {
    setNewItem({ ...newItem, [field]: value });
  };

  const handleCreateSave = async () => {
    const itemToAdd: InventoryItem = { ...newItem, id: uuidv4() };
    try {
      await axios.post(API_BASE_URL, itemToAdd);
      setItems(prev => [itemToAdd, ...prev]);
      setCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create item:', err);
      // You could show an error message to the user here
    }
  };

  const handleCreateCancel = () => {
    setCreateModalOpen(false);
  };

  return (    
    <div className="dashboard">
      <h1>Inventory Dashboard</h1>
      
      <Grid container spacing={3} className="stats-header">
        <Grid item xs={12} md={4}>
          <Paper elevation={2} className={`stats-box clickable${filterType === 'all' ? ' active' : ''}`} onClick={() => handleStatClick('all')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InventoryIcon className="icon primary" />
              <div>
                <Typography variant="h4">{items.length}</Typography>
                <Typography variant="subtitle1" color="text.secondary">Total Unique Items</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} className={`stats-box clickable${filterType === 'low' ? ' active' : ''}`} onClick={() => handleStatClick('low')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WarningAmberIcon className="icon warning" />
              <div>
                <Typography variant="h4">
                  {items.filter(item => item.quantity > 0 && item.quantity <= 10).length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">Low on Stock</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} className={`stats-box clickable${filterType === 'out' ? ' active' : ''}`} onClick={() => handleStatClick('out')}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ErrorIcon className="icon error" />
              <div>
                <Typography variant="h4">
                  {items.filter(item => item.quantity === 0).length}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">Out of Stock</Typography>
              </div>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2} className="search-actions" alignItems="center" justifyContent="space-between">
        <Grid item xs={12} md={6}>
          <SearchFilter 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </Grid>
        <Grid item xs={12} md="auto">
          <Button 
            variant="contained" 
            color="primary" 
            size="medium"
            className="add-button"
            onClick={handleAddNew}
          >
            Add New Item
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">Select</TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'name'}
                  direction={orderBy === 'name' ? order : 'asc'}
                  onClick={() => handleSort('name')}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'sku'}
                  direction={orderBy === 'sku' ? order : 'asc'}
                  onClick={() => handleSort('sku')}
                >
                  SKU
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'category'}
                  direction={orderBy === 'category' ? order : 'asc'}
                  onClick={() => handleSort('category')}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'price'}
                  direction={orderBy === 'price' ? order : 'asc'}
                  onClick={() => handleSort('price')}
                >
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'quantity'}
                  direction={orderBy === 'quantity' ? order : 'asc'}
                  onClick={() => handleSort('quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>${item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(item.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={editModalOpen} onClose={handleEditCancel}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" mb={2}>Edit Item</Typography>
          <TextField
            label="Name"
            value={editItem?.name || ''}
            onChange={e => handleEditFieldChange('name', e.target.value)}
            fullWidth
          />
          <TextField
            label="SKU"
            value={editItem?.sku || ''}
            onChange={e => handleEditFieldChange('sku', e.target.value)}
            fullWidth
          />
          <TextField
            label="Category"
            value={editItem?.category || ''}
            onChange={e => handleEditFieldChange('category', e.target.value)}
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={editItem?.price || ''}
            onChange={e => handleEditFieldChange('price', Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            value={editItem?.quantity || ''}
            onChange={e => handleEditFieldChange('quantity', Number(e.target.value))}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleEditCancel} color="inherit">Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={deleteModalOpen} onClose={handleDeleteCancel}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 340,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" mb={2}>Confirm Delete</Typography>
          <Typography mb={2}>Are you sure you want to delete this item?</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleDeleteCancel} color="inherit">Cancel</Button>
            <Button onClick={handleDeleteConfirm} variant="contained" color="error">Delete</Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={createModalOpen} onClose={handleCreateCancel}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}>
          <Typography variant="h6" mb={2}>Add New Item</Typography>
          <TextField
            label="Name"
            value={newItem.name}
            onChange={e => handleCreateFieldChange('name', e.target.value)}
            fullWidth
          />
          <TextField
            label="SKU"
            value={newItem.sku}
            onChange={e => handleCreateFieldChange('sku', e.target.value)}
            fullWidth
          />
          <TextField
            label="Category"
            value={newItem.category}
            onChange={e => handleCreateFieldChange('category', e.target.value)}
            fullWidth
          />
          <TextField
            label="Price"
            type="number"
            value={newItem.price}
            onChange={e => handleCreateFieldChange('price', Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={e => handleCreateFieldChange('quantity', Number(e.target.value))}
            fullWidth
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button onClick={handleCreateCancel} color="inherit">Cancel</Button>
            <Button onClick={handleCreateSave} variant="contained" color="primary">Save</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
