import axios from "axios";

async function getItemData() {
  const res = await axios.get("http://localhost:3001/api/items");
  const data = res.data;
  return data;
}

async function getItemUnitData() {
  const res = await axios.get(
    "http://localhost:3001/api/items/metadata/itemunit"
  );
  const data = res.data;
  return data;
}

async function getItemClassData() {
  const res = await axios.get(
    "http://localhost:3001/api/items/metadata/itemclass"
  );
  const data = res.data;
  return data;
}

async function getItemCategoryData() {
  const res = await axios.get(
    "http://localhost:3001/api/items/metadata/itemcategory"
  );
  const data = res.data;
  return data;
}

async function insertItemData(value) {
  const res = await axios.post(`http://localhost:3001/api/items/`, value);
  const data = res.data;
  console.log(data.message);
  return data.message;
}

async function getItemVariation(value) {
  try {
    const res = await axios.get(`http://localhost:3001/api/items/${value}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching item variation:", error);
    throw new Error("Failed to fetch item variation data");
  }
}

export {
  getItemData,
  getItemUnitData,
  getItemClassData,
  getItemCategoryData,
  getItemVariation,
  insertItemData,
};
