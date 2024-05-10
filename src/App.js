import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Outlet,
} from "react-router-dom";
import Accounts from './Accounts';
import Navbar from './components/Navbar';
import Home from "./Home";
import Vehicles from "./Vehicles";


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
      { path: "/vehicles", element: <Vehicles /> }

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