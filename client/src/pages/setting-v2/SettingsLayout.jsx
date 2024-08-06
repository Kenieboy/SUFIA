import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Customer from "./customer/Customer";
import Supplier from "./supplier/Supplier";

function SettingsLayout() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div>
        <Tabs defaultValue="customer" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-4 ">
            <TabsTrigger
              value="customer"
              className="text-xs flex gap-1 items-center"
            >
              Customer
            </TabsTrigger>
            <TabsTrigger
              value="supplier"
              className="text-xs flex gap-1 items-center"
            >
              Supplier
            </TabsTrigger>
            <TabsTrigger
              value="item"
              className="text-xs flex gap-1 items-center"
            >
              Item
            </TabsTrigger>
            <TabsTrigger
              value="accounts"
              className="text-xs flex gap-1 items-center"
            >
              Accounts
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-[1380px]" value="customer">
            <Customer />
          </TabsContent>
          <TabsContent className="w-[1380px]" value="supplier">
            <Supplier />
          </TabsContent>
          <TabsContent className="w-[1380px]" value="item">
            <h1>Item</h1>
          </TabsContent>
          <TabsContent className="w-[1380px]" value="accounts">
            <h1>Accounts</h1>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default SettingsLayout;
