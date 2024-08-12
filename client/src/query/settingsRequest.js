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

//=========================================================================

export async function getItemClassData() {
  const res = await axios.get(`${BASEURL}/settings/itemclass`);
  const data = res.data;
  return data;
}

export async function getItemClassId(Id) {
  const res = await axios.get(`${BASEURL}/settings/itemclass/${Id}`);
  const data = res.data;
  return data;
}

export async function insertItemClassData(value) {
  const res = await axios.post(`${BASEURL}/settings/itemclass/`, value);
  const data = res.data;
  return data;
}

export async function updateItemClassData(value) {
  const res = await axios.put(`${BASEURL}/settings/itemclass/`, value);
  const data = res.data;
  return data;
}

//==========================================================================

export async function getItemCategoryData() {
  const res = await axios.get(`${BASEURL}/settings/itemcategory`);
  const data = res.data;
  return data;
}

export async function getItemCategoryId(Id) {
  const res = await axios.get(`${BASEURL}/settings/itemcategory/${Id}`);
  const data = res.data;
  return data;
}

export async function insertItemCategoryData(value) {
  const res = await axios.post(`${BASEURL}/settings/itemcategory/`, value);
  const data = res.data;
  return data;
}

export async function updateItemCategoryData(value) {
  const res = await axios.put(`${BASEURL}/settings/itemcategory/`, value);
  const data = res.data;
  return data;
}

//==========================================================================

export async function getItemUnitData() {
  const res = await axios.get(`${BASEURL}/settings/itemunit`);
  const data = res.data;
  return data;
}

export async function getItemUnitId(Id) {
  const res = await axios.get(`${BASEURL}/settings/itemunit/${Id}`);
  const data = res.data;
  return data;
}

export async function insertItemUnitData(value) {
  const res = await axios.post(`${BASEURL}/settings/itemunit/`, value);
  const data = res.data;
  return data;
}

export async function updateItemUnitData(value) {
  const res = await axios.put(`${BASEURL}/settings/itemunit/`, value);
  const data = res.data;
  return data;
}

//==========================================================================

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
