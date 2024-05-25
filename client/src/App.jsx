// routing components
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  Navigate,
  NavLink,
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
import SettingLayout from "./pages/setting/SettingLayout";
import Customers from "./pages/setting/customers/Customers";

// for api request components
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Suppliers from "./pages/setting/suppliers/Suppliers";
import Items from "./pages/setting/items/Items";

function App() {
  const currentUser = true;

  const queryClient = new QueryClient();

  // layout for left navigation menu
  const Layout = () => {
    return (
      <div className="flex h-screen text-xs ">
        {/* left navigation */}
        <div className="bg-[#393a3d] w-[210px] flex flex-col justify-between p-6 text-white">
          <div>
            <div>
              <Link to="/">
                <h1 className="text-3xl font-bold">SU FIA</h1>
              </Link>
            </div>
            <div className="flex flex-col mt-4 gap-6 px-2">
              {/* isActive =  border-solid border-2 border-green-500 rounded-2xl px-4 py-2 */}
              <NavLink
                to="/procurement"
                className={({ isActive }) =>
                  isActive
                    ? `flex items-center gap-2 border-solid border-2 border-green-500 rounded-full px-4 py-1`
                    : `flex items-center gap-2`
                }
              >
                <PackageSearch />
                Procurement
              </NavLink>
              <NavLink
                to="/inventory"
                className={({ isActive }) =>
                  isActive
                    ? `flex items-center gap-2 border-solid border-2 border-green-500 rounded-full px-4 py-1`
                    : `flex items-center gap-2`
                }
              >
                <Warehouse />
                Inventory
              </NavLink>
              <NavLink
                to="/production"
                className={({ isActive }) =>
                  isActive
                    ? `flex items-center gap-2 border-solid border-2 border-green-500 rounded-full px-4 py-1`
                    : `flex items-center gap-2`
                }
              >
                <Factory />
                Production
              </NavLink>
              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  isActive
                    ? `flex items-center gap-2 border-solid border-2 border-green-500 rounded-full px-4 py-1`
                    : `flex items-center gap-2`
                }
              >
                <Repeat2 /> Reports
              </NavLink>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive
                    ? `flex items-center gap-2 border-solid border-2 border-green-500 rounded-full px-4 py-1`
                    : `flex items-center gap-2`
                }
              >
                <Settings /> Settings
              </NavLink>
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
        <QueryClientProvider client={queryClient}>
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        </QueryClientProvider>
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
          element: <SettingLayout />,
          children: [
            {
              path: "customers",
              element: <Customers />,
            },

            {
              path: "suppliers",
              element: <Suppliers />,
            },
            {
              path: "items",
              element: <Items />,
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
