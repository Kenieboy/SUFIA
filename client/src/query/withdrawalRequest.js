import axios from "axios";

async function getWithdrawalData() {
  const res = await axios.get(`http://localhost:3001/api/withdrawal`);
  const data = res.data;
  return data;
}

async function getSingleWithdrawalData(value) {
  const res = await axios.get(
    `http://localhost:3001/api/withdrawal/withdrawaldetail/${value}`
  );
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

async function updateWithdrawalData(value) {
  const res = await axios.put(`http://localhost:3001/api/withdrawal/`, value);
  const data = res.data;
  return data.message;
}

async function deleteWithdrawalDetailData(value) {
  const res = await axios.delete(
    `http://localhost:3001/api/withdrawal/${value}`
  );
  const data = res.data;
  return data.message;
}

export {
  getDepartmentAndSectionData,
  getWithdrawalData,
  getSingleWithdrawalData,
  insertWithdrawalData,
  updateWithdrawalData,
  deleteWithdrawalDetailData,
};
