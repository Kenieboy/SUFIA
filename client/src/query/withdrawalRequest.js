import axios from "axios";
import { BASEURL } from "./URL";

async function getWithdrawalData() {
  const res = await axios.get(`${BASEURL}/withdrawal`);
  const data = res.data;
  return data;
}

async function getSingleWithdrawalData(value) {
  const res = await axios.get(
    `${BASEURL}/withdrawal/withdrawaldetail/${value}`
  );
  const data = res.data;
  return data;
}

async function getDepartmentAndSectionData() {
  const res = await axios.get(`${BASEURL}/withdrawal/departments-sections`);
  const data = res.data;
  return data;
}

async function insertWithdrawalData(value) {
  const res = await axios.post(`${BASEURL}/withdrawal/`, value);
  const data = res.data;
  return data.message;
}

async function updateWithdrawalData(value) {
  const res = await axios.put(`${BASEURL}/withdrawal/`, value);
  const data = res.data;
  return data.message;
}

async function deleteWithdrawalDetailData(value) {
  const res = await axios.delete(`${BASEURL}/withdrawal/${value}`);
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
