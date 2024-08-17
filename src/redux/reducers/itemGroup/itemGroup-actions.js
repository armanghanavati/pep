import axios from "axios";

//-------------ItemGroup List Combo----------------------
export async function itemGroupListCombo(Token) {
  const url = window.apiAddress + "/ItemGroup/itemGroupComboList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All ItemGroup for combo" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
export async function itemGroupListBySupplierId(object, Token) {
  const url = window.apiAddress + "/ItemGroup/itemGroupListBySupplierId";
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
    console.log(
      "All ItemGroup by SupplierId for combo" + JSON.stringify(result.data)
    );
    return result.data;
  }
  return null;
}

export const groupBySupplierId = async (postData) => {
  const url = window.apiAddress + `/ItemGroup/itemGroupListBySupplierId`;
  const response = await axios.post(url, postData);
  return response?.data;
};
