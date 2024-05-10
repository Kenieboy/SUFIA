// shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// routing component
import { Link, Outlet } from "react-router-dom";

function SettingLayout() {
  return (
    <div>
      <div className="mb-6 ">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>
      <div>
        <Tabs defaultValue="customers" className="w-full">
          <TabsList>
            <TabsTrigger value="customers">
              <Link to="/settings/customers">Customers</Link>
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <Link to="/settings/suppliers">Suppliers</Link>
            </TabsTrigger>
            <TabsTrigger value="items">
              <Link to="/settings/items">Items</Link>
            </TabsTrigger>
            <TabsTrigger value="account-setup">
              <Link to="/settings/account-setup">Account Setup</Link>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            Make changes to your account here.
          </TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </div>
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingLayout;
