import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceivingReport from "./ReceivingReport";
import WithdrawalReport from "./WithdrawalReport";

function Reports() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Reports</h1>
      </div>

      <div>
        <Tabs defaultValue="receiving" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger
              value="receiving"
              className="text-xs flex gap-1 items-center"
            >
              {/* <PackagePlus width={20} height={20} /> */}
              Receiving
            </TabsTrigger>
            <TabsTrigger
              value="withdrawal"
              className="text-xs flex gap-1 items-center"
            >
              {/* <PackageMinus width={20} height={20} /> */}
              Withdrawal
            </TabsTrigger>
          </TabsList>
          <TabsContent className="w-[1380px]" value="receiving">
            <ReceivingReport />
          </TabsContent>
          <TabsContent className="w-[1380px]" value="withdrawal">
            <WithdrawalReport />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default Reports;
