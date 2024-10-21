import { useEffect } from "react";

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
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import SettingsMain from "./pages/setting-v2/SettingsLayout";
import SettingsLayout from "./pages/setting-v2/SettingsLayout";

import { useSelector } from "react-redux";
import Login from "./pages/login/Login";

function App() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  // clear local storage on closing app
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleBeforeUnload = () => {
    localStorage.clear();
  };

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
          children: [{ path: "receiving", element: <div>receiving</div> }],
        },
        {
          path: "production",
          element: <Production />,
          children: [
            {
              path: "newproduction",
              element: <h1>TEST ROUTE</h1>,
            },
          ],
        },
        {
          path: "newproduction",
          element: (
            <div>
              <h1>NEW PRODUCTION</h1>
              <Link to="/production">to production</Link>
            </div>
          ),
        },
        {
          path: "newdailyconsumption",
          element: (
            <div>
              <h1>NEW PDC</h1>
              <Link to="/production">to production</Link>
            </div>
          ),
        },
        {
          path: "reports",
          element: <Reports />,
        },
        {
          path: "settings",
          element: <SettingLayout />,
          // children: [
          //   {
          //     path: "customers",
          //     element: <Customers />,
          //   },

          //   {
          //     path: "suppliers",
          //     element: <Suppliers />,
          //   },
          //   {
          //     path: "items",
          //     element: <Items />,
          //   },
          //   {
          //     path: "account-setup",
          //     element: (
          //       <div>
          //         <h1>Account Setup</h1>
          //       </div>
          //     ),
          //   },
          // ],
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
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
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
