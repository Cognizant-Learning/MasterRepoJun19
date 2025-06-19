import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Inventory } from './components/Inventory/Inventory';
import './App.scss';

function App() {
  return (
    <Router>
      <div className="app">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Inventory Management System
            </Typography>
            <Button color="inherit" component={Link} to="/">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/inventory">
              Inventory
            </Button>
          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/create" element={<Inventory />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
