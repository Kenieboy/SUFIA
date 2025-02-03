import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivingReport from "./ReceivingReport";
import WithdrawalReport from "./WithdrawalReport";
import { FileText } from "lucide-react";
import ProductConsumptionReport from "./ProductConsumptionReport";

function Reports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>

      <div>
        <Tabs defaultValue="receiving" className="w-[600px]">
          <TabsList className="grid w-full grid-cols-3 ">
            <TabsTrigger
              value="receiving"
              className="text-xs flex gap-1 items-center"
            >
              {/* <PackagePlus width={20} height={20} /> */}
              <FileText width={20} height={20} />
              Receiving
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              className="text-xs flex gap-1 items-center"
            >
              {/* <PackageMinus width={20} height={20} /> */}
              <FileText width={20} height={20} />
              Withdrawal
            </TabsTrigger>
            <TabsTrigger
              value="pcr"
              className="text-xs flex gap-1 items-center"
            >
              {/* <PackageMinus width={20} height={20} /> */}
              <FileText width={20} height={20} />
              Product Consumption
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-[1380px]" value="receiving">
            <ReceivingReport />
          </TabsContent>
          <TabsContent className="w-[1380px]" value="withdrawal">
            <WithdrawalReport />
          </TabsContent>
          <TabsContent className="w-[1380px]" value="pcr">
            <ProductConsumptionReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Reports;
