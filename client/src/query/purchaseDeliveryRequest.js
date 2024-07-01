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

async function updatePurchaseDeliveryData(value) {
  const res = await axios.put(
    `http://localhost:3001/api/purchasedelivery/`,
    value
  );
  const data = res.data;
  return data.message;
}

async function deletePurchaseDeliveryData(Id) {
  try {
    const res = await axios.delete(
      `http://localhost:3001/api/purchasedelivery/${Id}`
    );
    return res.data.message;
  } catch (error) {
    console.error("Error deleting purchase delivery detail:", error);
    throw error;
  }
}

export {
  insertPurchaseDeliveryData,
  updatePurchaseDeliveryData,
  deletePurchaseDeliveryData,
  getPurchaseDeliveryData,
  getPurchaseDeliveryDetailData,
};
