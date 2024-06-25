import axios from "axios";

async function insertPurchaseDeliveryData(value) {
  const res = await axios.post(
    `http://localhost:3001/api/purchasedelivery/`,
    value
  );
  const data = res.data;
  return data.message;
}

export { insertPurchaseDeliveryData };
