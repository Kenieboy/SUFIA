import axios from "axios";
import { BASEURL } from "./API";

async function getProductItem() {
  const res = await axios.get(`${BASEURL}/production`);
  const data = res.data;
  return data;
}

async function getProductSection() {
  const res = await axios.get(`${BASEURL}/production/section`);
  const data = res.data;
  return data;
}

async function insertProductSection(value) {
  try {
    const res = await axios.post(`${BASEURL}/production/section`, value);
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

async function insertProductStandardConsumption(value) {
  try {
    const res = await axios.post(
      `${BASEURL}/production/standard-consumption`,
      value
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}

const getProductStandardConsumptionDetail = async (value) => {
  try {
    const res = await axios.get(
      `${BASEURL}/production/standard-consumption-detail`,
      { params: value }
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

const insertProductDailyConsumption = async (value) => {
  try {
    const res = await axios.post(
      `${BASEURL}/production/daily-consumption`,
      value
    );
    return res.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

async function getStandardConsumptionData() {
  const res = await axios.get(`${BASEURL}/production/standard-consumption`);
  const data = res.data;
  return data;
}

async function getProductStandardConsumptionById(value) {
  const res = await axios.get(
    `${BASEURL}/production/standard-consumption-data/${value}`
  );
  const data = res.data;
  return data;
}

async function updateProductStandardConsumptionData(value) {
  const res = await axios.post(
    `${BASEURL}/production/update-standard-consumption-detail`,
    value
  );
  const data = res.data;
  return data;
}

async function getDailyConsumptionData() {
  const res = await axios.get(`${BASEURL}/production/daily-consumption`);
  const data = res.data;
  return data;
}

async function getProductDailyConsumptionById(value) {
  const res = await axios.get(
    `${BASEURL}/production/daily-consumption-data/${value}`
  );
  const data = res.data;
  return data;
}

async function updateProductDailyConsumptionData(value) {
  const res = await axios.post(
    `${BASEURL}/production/update-daily-consumption-detail`,
    value
  );
  const data = res.data;
  return data;
}

async function getItemDetail(value) {
  const res = await axios.get(`${BASEURL}/production/item-details/${value}`);
  const data = res.data;
  return data;
}

async function insertMonthlyProductEntry(value) {
  const res = await axios.post(
    `${BASEURL}/production/insertProductionWithDetails`,
    value
  );
  const data = res.data;
  return data;
}

async function getMonthlyProductData() {
  const res = await axios.get(
    `${BASEURL}/production/monthly-product-entry-data`
  );
  const data = res.data;
  return data;
}

async function getMonthlyProductDetail(value) {
  const res = await axios.get(`${BASEURL}/production/${value}/details`);
  const data = res.data;
  return data;
}

export {
  getProductItem,
  getProductSection,
  getProductStandardConsumptionDetail,
  getProductStandardConsumptionById,
  getStandardConsumptionData,
  getDailyConsumptionData,
  getProductDailyConsumptionById,
  getMonthlyProductData,
  getMonthlyProductDetail,
  getItemDetail,
  insertProductSection,
  insertProductStandardConsumption,
  insertProductDailyConsumption,
  insertMonthlyProductEntry,
  updateProductStandardConsumptionData,
  updateProductDailyConsumptionData,
};
