// routing components
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  Navigate,
} from "react-router-dom";

// pages
import Procurement from "./pages/procurement/Procurement";
import Inventory from "./pages/inventory/Inventory";
import Production from "./pages/production/Production";
import Reports from "./pages/reports/Reports";
import Dashboard from "./pages/dashboard/Dashboard";
import UserLogged from "./custom-components/user/UserLogged";
import Setting from "./pages/setting/Setting";

// icons
import {
  Settings,
  Repeat2,
  Factory,
  Warehouse,
  PackageSearch,
} from "lucide-react";
import SettingRoute from "./pages/setting/SettingRoute";
import Customers from "./pages/setting/customers/Customers";
import CustomerId from "./pages/setting/customers/customerId/CustomerId";

function App() {
  const currentUser = true;

  // layout for left navigation menu
  const Layout = () => {
    return (
      <div className="flex h-screen text-xs ">
        {/* left navigation */}
        <div className="bg-[#393a3d] w-[210px] flex flex-col justify-between p-6 text-white">
          <div>
            <div>
              <Link to="/">
                <h1 className="text-3xl font-bold">s u f i a</h1>
              </Link>
            </div>
            <div className="flex flex-col mt-4 gap-4 px-2">
              <Link to="/procurement" className="flex items-center gap-2">
                <PackageSearch />
                Procurement
              </Link>
              <Link to="/inventory" className="flex items-center gap-2">
                <Warehouse />
                Inventory
              </Link>
              <Link to="/production" className="flex items-center gap-2">
                <Factory />
                Production
              </Link>
              <Link to="/reports" className="flex items-center gap-2">
                <Repeat2 /> Reports
              </Link>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings /> Settings
              </Link>
            </div>
          </div>

          {/* user loggedIn */}
          <div>
            <UserLogged />
          </div>
          {/* user loggedIn End */}
        </div>
        {/* left navigation end */}

        {/* outlet */}
        <div className="flex-1 p-6 overflow-y-scroll">
          <Outlet />
        </div>
        {/* outlet end */}
      </div>
    );
  };

  // dashboard route protected
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "procurement",
          element: <Procurement />,
        },
        {
          path: "inventory",
          element: <Inventory />,
        },
        {
          path: "production",
          element: <Production />,
        },
        {
          path: "reports",
          element: <Reports />,
        },
        {
          path: "settings",
          element: <SettingRoute />,
          children: [
            {
              path: "customers",
              element: <Customers />,
              children: [
                {
                  path: ":customerId",
                  element: <CustomerId />,
                },
              ],
            },

            {
              path: "suppliers",
              element: (
                <div>
                  <h1>Suppliers</h1>
                </div>
              ),
            },
            {
              path: "items",
              element: (
                <div>
                  <h1>Items</h1>
                </div>
              ),
            },
            {
              path: "account-setup",
              element: (
                <div>
                  <h1>Account Setup</h1>
                </div>
              ),
            },
          ],
        },
      ],
    },
    {
      path: "/login",
      element: (
        <div>
          <h1>Login Page!</h1>
          <div>
            <span>
              don't have an account yet,{" "}
              <Link to="/register">register here!</Link>
            </span>
          </div>
        </div>
      ),
    },
    {
      path: "/register",
      element: (
        <div>
          <h1>Register Page!</h1>
        </div>
      ),
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
