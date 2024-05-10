import axios from "axios";

async function getFirmData() {
  const req = await axios.get(`http://localhost:3001/api/firm`);
  const data = await req.data;
  return data;
}

async function getFirmCustomer() {
  const req = await axios.get(`http://localhost:3001/api/firm?class=1`);
  const data = await req.data;
  return data;
}

async function getFirmSupplier() {
  const req = await axios.get(`http://localhost:3001/api/firm?class=2`);
  const data = await req.data;
  return data;
}

export { getFirmData, getFirmCustomer, getFirmSupplier };
