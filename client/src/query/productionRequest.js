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
  console.log("Request body:", value);
  try {
    const res = await axios.post(
      `${BASEURL}/production/standard-consumption-detail`,
      value // Pass `value` as the body
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

export {
  getProductItem,
  getProductSection,
  getProductStandardConsumptionDetail,
  insertProductSection,
  insertProductStandardConsumption,
};
