import React from 'react';
import { Paper, Grid, Typography, Box } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import { InventoryItem } from '../../types/InventoryItem';
import './StatsHeader.scss';

interface StatsHeaderProps {
  items: InventoryItem[];
  lowStockThreshold?: number;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({ items, lowStockThreshold = 10 }) => {
  const totalItems = items.length;
  const lowStockItems = items.filter(item => item.quantity > 0 && item.quantity <= lowStockThreshold).length;
  const outOfStockItems = items.filter(item => item.quantity === 0).length;

  return (
    <Grid container spacing={3} className="stats-header">
      <Grid item xs={12} md={4}>
        <Paper className="stat-card total">
          <Box className="stat-content">
            <InventoryIcon className="icon" />
            <div className="stat-text">
              <Typography variant="h4">{totalItems}</Typography>
              <Typography variant="subtitle1">Total Unique Items</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper className="stat-card warning">
          <Box className="stat-content">
            <WarningAmberIcon className="icon" />
            <div className="stat-text">
              <Typography variant="h4">{lowStockItems}</Typography>
              <Typography variant="subtitle1">Low on Stock</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper className="stat-card danger">
          <Box className="stat-content">
            <ErrorIcon className="icon" />
            <div className="stat-text">
              <Typography variant="h4">{outOfStockItems}</Typography>
              <Typography variant="subtitle1">Out of Stock</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
