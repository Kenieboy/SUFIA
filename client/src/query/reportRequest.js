import axios from "axios";

async function getPurchaseDeliveryDetailReport() {
  const res = await axios.get(`http://localhost:3001/api/report`);
  const data = res.data;
  return data;
}

export { getPurchaseDeliveryDetailReport };
