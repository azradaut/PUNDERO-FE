import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Accounts from './pages/Accounts';
import Navbar from './components/Navbar';
import Home from "./pages/Home";
import Vehicles from "./pages/Vehicles";
import Products from "./pages/Products";
import MapCoordinator from "./pages/MapCoordinator";


const Layout = () => {
  return(
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path:"/",
        element: <Home />
      },
      {
        path:"/accounts",
        element: <Accounts />
      },
      { path: "/vehicles", element: <Vehicles /> },
      { path: "/products", element: <Products /> },
      { path: "/loginpage", element: <LoginPage /> },
      { path: "/mapcoordinator", element: <MapCoordinator /> }

    ]
  }
])

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