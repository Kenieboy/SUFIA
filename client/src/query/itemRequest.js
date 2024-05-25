import axios from "axios";

async function getItemData() {
  const res = await axios.get("http://localhost:3001/api/items");
  const data = res.data;
  return data;
}

export { getItemData };
