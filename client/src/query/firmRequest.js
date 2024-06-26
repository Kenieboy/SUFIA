import axios from "axios";

async function getFirmData() {
  const req = await axios.get(`http://localhost:3001/api/firm`);
  const data = await req.data;
  return data;
}

// ======================== customer request transaction ===========================
async function getFirmCustomer() {
  const req = await axios.get(`http://localhost:3001/api/firm?class=1`);
  const data = await req.data;
  return data;
}

async function insertCustomerData(value) {
  const req = await axios.post(`http://localhost:3001/api/firm`, value);
  const data = await req.data;
  return data.message;
}

async function updateCustomerData(value) {
  const { ID, ...others } = value;
  const req = await axios.put(`http://localhost:3001/api/firm/${ID}`, others);
  const data = await req.data;
  return data.message;
}

// ======================== supplier request transaction ============================
async function getFirmSupplier() {
  const req = await axios.get(`http://localhost:3001/api/firm?class=2`);
  const data = await req.data;
  return data;
}

async function insertSupplierData(value) {
  const req = await axios.post(`http://localhost:3001/api/firm`, value);
  const data = await req.data;
  return data.message;
}

async function updateSupplierData(value) {
  const { ID, ...others } = value;
  const req = await axios.put(`http://localhost:3001/api/firm/${ID}`, others);
  const data = await req.data;
  return data.message;
}

export {
  getFirmData,
  getFirmCustomer,
  getFirmSupplier,
  insertCustomerData,
  updateCustomerData,
  insertSupplierData,
  updateSupplierData,
};
