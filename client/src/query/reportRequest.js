import axios from "axios";
import { BASEURL } from "./API";

async function getPurchaseDeliveryDetailReport() {
  const res = await axios.get(`${BASEURL}/report`);
  const data = res.data;
  return data;
}

async function getWithdrawalDetailReport() {
  const res = await axios.get(`${BASEURL}/report/withdrawalReport`);
  const data = res.data;
  return data;
}

async function getProductConsumptionReport(startDate, endDate) {
  const res = await axios.get(`${BASEURL}/report/material-consumption`, {
    params: { startDate, endDate }, // Pass dates as query params
  });
  const data = res.data;
  return data;
}

export {
  getPurchaseDeliveryDetailReport,
  getWithdrawalDetailReport,
  getProductConsumptionReport,
};
