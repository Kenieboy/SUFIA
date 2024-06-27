import axios from "axios";

async function getPurchaseDeliveryData(value) {
  const res = await axios.get(
    `http://localhost:3001/api/purchasedelivery/`,
    value
  );
  const data = res.data;
  return data;
}

async function getPurchaseDeliveryDetailData(value) {
  const res = await axios.get(
    `http://localhost:3001/api/purchasedelivery/pddItemVariation/${value}`
  );
  const data = res.data;
  return data;
}

async function insertPurchaseDeliveryData(value) {
  const res = await axios.post(
    `http://localhost:3001/api/purchasedelivery/`,
    value
  );
  const data = res.data;
  return data.message;
}

export {
  insertPurchaseDeliveryData,
  getPurchaseDeliveryData,
  getPurchaseDeliveryDetailData,
};
