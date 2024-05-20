// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Outlet
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Accounts from './pages/Coordinator/Accounts';
import Vehicles from "./pages/Coordinator/Vehicles";
import MapCoordinator from "./pages/Coordinator/MapCoordinator";
import CoordinatorDashboard from './pages/Coordinator/CoordinatorDashboard';
import ClientDashboard from './pages/Client/ClientDashboard';
import Products from './pages/Client/Products'; // Import the Products page
import CreateOrder from './pages/Client/CreateOrder'; // Import the CreateOrder page
import Notifications from './pages/Notifications'; // Import the Notifications page
import PendingInvoices from './pages/Coordinator/PendingInvoices'; // Import the PendingInvoices page
import Invoices from './pages/Coordinator/Invoices'; // Import the Invoices page
import ProtectedRoute from './components/ProtectedRoute';
import CoordinatorNavbar from './components/CoordinatorNavbar';
import ClientNavbar from './components/ClientNavbar';
import { NotificationProvider } from './contexts/NotificationContext'; // Import the NotificationProvider

const CoordinatorLayout = () => {
  return (
    <>
      <CoordinatorNavbar />
      <Outlet />
    </>
  );
};

const ClientLayout = () => {
  return (
    <>
      <ClientNavbar />
      <Outlet />
    </>
  );
};

function App() {
  const [cart, setCart] = useState([]); // State for managing the cart

  return (
    <NotificationProvider> {/* Wrap the entire app with NotificationProvider */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/coordinator"
            element={
              <ProtectedRoute role={1}>
                <CoordinatorLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<CoordinatorDashboard />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="map" element={<MapCoordinator />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route
            path="/client"
            element={
              <ProtectedRoute role={2}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="products" element={<Products cart={cart} setCart={setCart} />} /> {/* Pass cart and setCart as props */}
            <Route path="create-order" element={<CreateOrder cart={cart} setCart={setCart} />} /> {/* Pass cart and setCart as props */}
            <Route path="notifications" element={<Notifications />} />
          </Route>
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;
