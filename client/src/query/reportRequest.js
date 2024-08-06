import axios from "axios";
import { BASEURL } from "./URL";

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
export { getPurchaseDeliveryDetailReport, getWithdrawalDetailReport };
