// shadcn components

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Receiving from "./receiving/Receiving";
import Withdrawal from "./withdrawal/Withdrawal";
import { PackageMinus, PackagePlus } from "lucide-react";

function Inventory() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Inventory</h1>
      </div>

      <div>
        <Tabs defaultValue="receiving" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger
              value="receiving"
              className="text-xs flex gap-1 items-center"
            >
              <PackagePlus width={20} height={20} />
              Receiving
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              className="text-xs flex gap-1 items-center"
            >
              <PackageMinus width={20} height={20} />
              Withdrawal
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-[1380px]" value="receiving">
            <Receiving />
          </TabsContent>
          <TabsContent className="w-[1380px]" value="withdrawal">
            <Withdrawal />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Inventory;
