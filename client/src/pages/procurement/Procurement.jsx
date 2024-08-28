import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Items from "./items/Items";

function Procurement() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Procurement</h1>
      </div>

      <div>
        <Tabs defaultValue="supplier" className="max-w-full">
          <TabsList>
            <TabsTrigger value="supplier" className="text-xs">
              Supplier
            </TabsTrigger>
            <TabsTrigger value="item" className="text-xs">
              Item
            </TabsTrigger>
          </TabsList>

          <TabsContent value="supplier">
            <h1>Supplier</h1>
          </TabsContent>
          <TabsContent value="item">
            <Items />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Procurement;
