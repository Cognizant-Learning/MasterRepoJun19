import React from 'react';
import { Container } from 'react-bootstrap';
import InventoryList from '../components/InventoryList';

const Home: React.FC = () => {
  return (
    <Container>
      <InventoryList />
    </Container>
  );
};

export default Home;
