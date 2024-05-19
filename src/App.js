// src/App.js
import {
  createBrowserRouter,
  RouterProvider,
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
import ProtectedRoute from './components/ProtectedRoute';
import CoordinatorNavbar from './components/CoordinatorNavbar';
import ClientNavbar from './components/ClientNavbar';

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/coordinator",
    element: (
      <ProtectedRoute role={1}>
        <CoordinatorLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <CoordinatorDashboard /> },
      { path: "accounts", element: <Accounts /> },
      { path: "vehicles", element: <Vehicles /> },
      { path: "map", element: <MapCoordinator /> },
    ],
  },
  {
    path: "/client",
    element: (
      <ProtectedRoute role={2}>
        <ClientLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "dashboard", element: <ClientDashboard /> },
    ],
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
