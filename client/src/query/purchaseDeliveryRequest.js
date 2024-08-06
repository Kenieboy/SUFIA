import axios from "axios";
import { BASEURL } from "./URL";

async function getPurchaseDeliveryData(value) {
  const res = await axios.get(`${BASEURL}/purchasedelivery/`, value);
  const data = res.data;
  return data;
}

async function getPurchaseDeliveryDetailData(value) {
  const res = await axios.get(
    `${BASEURL}/purchasedelivery/pddItemVariation/${value}`
  );
  const data = res.data;
  return data;
}

async function insertPurchaseDeliveryData(value) {
  const res = await axios.post(`${BASEURL}/purchasedelivery/`, value);
  const data = res.data;
  return data.message;
}

async function updatePurchaseDeliveryData(value) {
  const res = await axios.put(`${BASEURL}/purchasedelivery/`, value);
  const data = res.data;
  return data.message;
}

async function deletePurchaseDeliveryData(Id) {
  try {
    const res = await axios.delete(`${BASEURL}/purchasedelivery/${Id}`);
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
