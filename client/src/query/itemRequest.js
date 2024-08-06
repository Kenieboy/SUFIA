import axios from "axios";
import { BASEURL } from "./URL";

async function getItemData() {
  const res = await axios.get(`${BASEURL}/items`);
  const data = res.data;
  return data;
}

async function getItemUnitData() {
  const res = await axios.get(`${BASEURL}/items/metadata/itemunit`);
  const data = res.data;
  return data;
}

async function getItemClassData() {
  const res = await axios.get(`${BASEURL}/items/metadata/itemclass`);
  const data = res.data;
  return data;
}

async function getItemCategoryData() {
  const res = await axios.get(`${BASEURL}/items/metadata/itemcategory`);
  const data = res.data;
  return data;
}

async function insertItemData(value) {
  const res = await axios.post(`${BASEURL}/items/`, value);
  const data = res.data;
  return data.message;
}

async function updateItemData(value) {
  //console.log(`${BASEURL}/items/`, value);
  const res = await axios.put(`${BASEURL}/items/`, value);
  const data = res.data;
  return data.message;
}

async function getItemVariation(value) {
  try {
    const res = await axios.get(`${BASEURL}/items/${value}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching item variation:", error);
    throw new Error("Failed to fetch item variation data");
  }
}

async function deleteFromItemVariationId(value) {
  const res = await axios.delete(`${BASEURL}/items/itemvariation/${value}`);
  const data = res.data;
  return data.message;
}

async function getPurchaseDeliveryDetail(value) {
  const res = await axios.get(`${BASEURL}/items/itemdetail/${value}`);
  const data = res.data;
  return data;
}

export {
  getItemData,
  getItemUnitData,
  getItemClassData,
  getItemCategoryData,
  getItemVariation,
  getPurchaseDeliveryDetail,
  insertItemData,
  updateItemData,
  deleteFromItemVariationId,
};
