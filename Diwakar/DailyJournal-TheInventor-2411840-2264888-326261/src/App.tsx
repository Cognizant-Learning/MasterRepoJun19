import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Journal from './pages/Journal';
import Mood from './pages/Mood';
import Insights from './pages/Insights';
import Notifications from './pages/Notifications';
import Privacy from './pages/Privacy';
import './App.css';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/*" element={<Auth />} />
        <Route path="/journal/*" element={<Journal />} />
        <Route path="/mood/*" element={<Mood />} />
        <Route path="/insights/*" element={<Insights />} />
        <Route path="/notifications/*" element={<Notifications />} />
        <Route path="/privacy/*" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export default App;
