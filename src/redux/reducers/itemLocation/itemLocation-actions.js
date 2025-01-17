import axios from "axios";

export async function itemLocationList(object, Token) {
  const url = window.apiAddress + "/ItemLocation/itemlocationList";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All item location" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function updateItemLocation(Object, Token) {
  const url = window.apiAddress + "/ItemLocation/updateItemLocation";
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("ItemLocation update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export const copyItemLocationGroup = async (postData) => {
  const url = window.apiAddress + `/ItemLocation/copyItemLocationGroup`;
  const response = await axios.post(url, postData);
  console.log(response);
  return response?.data;
};

export const userLocationListByUserId = async (userId, companyId) => {
  const url =
    window.apiAddress +
    "/User/userLocationListCombo?userId="+userId+"&companyId="+companyId;
  return axios.get(url);
};