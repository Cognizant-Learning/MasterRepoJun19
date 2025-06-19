import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Home from './pages/Home';
import Analytics from './pages/AnalyticsNew';
import Notifications from './pages/Notifications';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="py-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" />
    </Router>
  );
};

export default App;
