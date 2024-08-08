// shadcn components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Department from "./department/Department";
import Section from "./section/Section";
import ItemClass from "./itemclass/ItemClass";
import ItemCategory from "./itemcategory/ItemCategory";
import Unit from "./unit/Unit";

function SettingLayout() {
  return (
    <div>
      <div>
        <div className="mb-6 ">
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
        <div>
          <Tabs defaultValue="department" className="max-w-full">
            <TabsList>
              <TabsTrigger value="department" className="text-xs">
                Department
              </TabsTrigger>
              <TabsTrigger value="section" className="text-xs">
                Section
              </TabsTrigger>
              <TabsTrigger value="itemclass" className="text-xs">
                Item Class
              </TabsTrigger>
              <TabsTrigger value="itemcategory" className="text-xs">
                Item Category
              </TabsTrigger>
              <TabsTrigger value="unit" className="text-xs">
                Unit
              </TabsTrigger>
            </TabsList>

            <TabsContent value="department">
              <Department />
            </TabsContent>
            <TabsContent value="section">
              <Section />
            </TabsContent>
            <TabsContent value="itemclass">
              <ItemClass />
            </TabsContent>
            <TabsContent value="itemcategory">
              <ItemCategory />
            </TabsContent>
            <TabsContent value="unit">
              <Unit />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* <div className="mt-6">
        <Outlet />
      </div> */}
    </div>
  );
}

export default SettingLayout;
