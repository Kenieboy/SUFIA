import axios from "axios";

async function getWithdrawalData() {
  const res = await axios.get(`http://localhost:3001/api/withdrawal`);
  const data = res.data;
  return data;
}

async function getDepartmentAndSectionData() {
  const res = await axios.get(
    `http://localhost:3001/api/withdrawal/departments-sections`
  );
  const data = res.data;
  return data;
}

async function insertWithdrawalData(value) {
  const res = await axios.post(`http://localhost:3001/api/withdrawal/`, value);
  const data = res.data;
  return data.message;
}

export { getDepartmentAndSectionData, getWithdrawalData, insertWithdrawalData };
