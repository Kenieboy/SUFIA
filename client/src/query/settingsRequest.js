import axios from "axios";
import { BASEURL } from "./API";

//department
async function getDepartmentData() {
  const res = await axios.get(`${BASEURL}/settings/department`);
  const data = res.data;
  return data;
}

async function getDepartmentId(Id) {
  const res = await axios.get(`${BASEURL}/settings/department/${Id}`);
  const data = res.data;
  return data;
}

async function insertDepartmentData(value) {
  const res = await axios.post(`${BASEURL}/settings/department/`, value);
  const data = res.data;
  return data;
}

async function updateDepartmentData(value) {
  const res = await axios.put(`${BASEURL}/settings/department/`, value);
  const data = res.data;
  return data;
}
//department end =========================================================================

async function getSectionData() {
  const res = await axios.get(`${BASEURL}/settings/section`);
  const data = res.data;
  return data;
}

async function getSectionId(Id) {
  const res = await axios.get(`${BASEURL}/settings/section/${Id}`);
  const data = res.data;
  return data;
}

async function insertSectionData(value) {
  const res = await axios.post(`${BASEURL}/settings/section/`, value);
  const data = res.data;
  return data;
}

async function updateSectionData(value) {
  const res = await axios.put(`${BASEURL}/settings/section/`, value);
  const data = res.data;
  return data;
}

export {
  getDepartmentData,
  getDepartmentId,
  insertDepartmentData,
  updateDepartmentData,
  getSectionData,
  getSectionId,
  insertSectionData,
  updateSectionData,
};
