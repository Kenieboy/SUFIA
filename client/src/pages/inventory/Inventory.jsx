// shadcn components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Receiving from "./receiving/Receiving";

function Inventory() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Inventory</h1>
      </div>

      <div>
        <Tabs defaultValue="receiving" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receiving">Receiving</TabsTrigger>
            <TabsTrigger value="password">Item</TabsTrigger>
          </TabsList>
          <TabsContent className="w-[1000px]" value="receiving">
            <Receiving />
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Inventory;
