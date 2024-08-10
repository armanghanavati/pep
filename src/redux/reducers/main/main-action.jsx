import axios from "axios";

export const getTableFields = async (object) => {
  const url = window.apiAddress + `/Common/getTableFields?objectName=${object}`;
  const response = await axios.patch(url);
  console.log(response);
  return response?.data;
};
