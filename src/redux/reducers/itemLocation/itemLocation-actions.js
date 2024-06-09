export async function itemLocationList(object, Token) {
  const url =
    window.apiAddress + "/ItemLocation/itemlocationList";
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

