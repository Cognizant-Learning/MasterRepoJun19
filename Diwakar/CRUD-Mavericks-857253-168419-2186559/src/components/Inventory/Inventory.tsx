import { useState } from 'react';
import {
  TextField,
  Button,
  Paper,
  Grid,
  Typography,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { InventoryItem } from '../../types/InventoryItem';
import './Inventory.scss';

export const Inventory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    sku: '',
    category: '',
    price: 0,
    quantity: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log(formData);
  };

  return (
    <div className="inventory">
      <Typography variant="h4" gutterBottom>
        Inventory Management
      </Typography>
      <Paper className="form-container">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="flex-end" gap={2}>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                style={{ width: '200px' }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ width: '200px' }}
              >
                Save Item
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};
