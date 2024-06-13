import React, { useState} from 'react';
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
import Products from './pages/Client/Products'; 
import ReviewOrder from './pages/Client/ReviewOrder'; 
import Notifications from './pages/Notifications'; 
import PendingInvoices from './pages/Coordinator/PendingInvoices'; 
import Invoices from './pages/Coordinator/Invoices'; 
import ProtectedRoute from './components/ProtectedRoute';
import CoordinatorNavbar from './components/CoordinatorNavbar';
import ClientNavbar from './components/ClientNavbar';
import MainContentLayout from './components/MainContentLayout'; // Import the new layout component
import { NotificationProvider } from './contexts/NotificationContext'; 
import Coordinators from './pages/Coordinator/Coordinators';
import OrderConfirmation from './pages/Client/OrderConfirmation';
import DeliveredInvoices from './pages/Client/DeliveredInvoices';
import ClientMap from './pages/Client/ClientMap';
import Clients from './pages/Coordinator/Clients';
import Drivers from './pages/Coordinator/Drivers';
import AssignMobile from './pages/Coordinator/AssignMobile';
import AssignVehicle from './pages/Coordinator/AssignVehicle';
import ClientInvoices from './pages/Client/ClientInvoices';
import Mobiles from './pages/Coordinator/Mobiles';
import Stores from './pages/Coordinator/Stores';
import ProductsCoordiantor from './pages/Coordinator/ProductsCoordiantor';

const CoordinatorLayout = () => {
  return (
    <>
      <CoordinatorNavbar />
      <MainContentLayout>
        <Outlet />
      </MainContentLayout>
    </>
  );
};

const ClientLayout = () => {
  return (
    <>
      <ClientNavbar />
      <MainContentLayout>
        <Outlet />
      </MainContentLayout>
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
            <Route path="stores" element={<Stores />} />
            <Route path="products_coordinator" element={<ProductsCoordiantor />} />
            <Route path="mobiles" element={<Mobiles />} />
            <Route path="map" element={<MapCoordinator />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="pending-invoices" element={<PendingInvoices />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="coordinators" element={<Coordinators />} />
            <Route path="clients" element={<Clients />} />
            <Route path="drivers" element={<Drivers />} />
            <Route path="assignmobile" element={<AssignMobile />} />
            <Route path="assignvehicle" element={<AssignVehicle />} />

          </Route>
          <Route
            path="/client"
            element={
              <ProtectedRoute role={3}>
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<ClientDashboard />} />
            <Route path="products" element={<Products cart={cart} setCart={setCart} />} /> {/* Pass cart and setCart as props */}
            <Route path="review-order" element={<ReviewOrder cart={cart} setCart={setCart} />} /> {/* Pass cart and setCart as props */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="client-invoices" element={<ClientInvoices />} />
            <Route path="delivered-invoices" element={<DeliveredInvoices />} />
            <Route path="client-map" element={<ClientMap />} />
            <Route path="order-confirmation" element={<OrderConfirmation cart={cart} setCart={setCart} />} /> {/* Pass cart and setCart as props */}
          </Route>
        </Routes>
       </Router>
    </NotificationProvider>
          );

};

export default App;
