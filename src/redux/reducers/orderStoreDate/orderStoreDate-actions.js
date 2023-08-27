export async function orderStoreDateList(comapnyId, locationId, Token) {
  const url =
    window.apiAddress +
    "/OrderStoreDate/orderStoreDateList?companyId=" +
    comapnyId + "&locationId=" + locationId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All orderStoreDate" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addOrderStoreDate(Object, Token) {
  const url = window.apiAddress + "/OrderStoreDate/addOrderStoreDate";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });

  const result = await response.json();
  if (result.status == "Success") {
    console.log(
      "RESULT OF ADD NEW orderStoreDate=" + JSON.stringify(result.data)
    );
    return result.data;
  }
  return null;
}
