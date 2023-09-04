export async function orderStoreSupplierDateList(comapnyId, locationId, supplierId, Token) {
    const url =
      window.apiAddress +
      "/OrderStoreSupplierDate/orderStoreSupplierDateList?companyId=" +
      comapnyId + "&locationId=" + locationId + "&supplierId=" + supplierId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All orderStoreSupplierDate" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addOrderStoreSupplierDate(Object, Token) {
    const url = window.apiAddress + "/OrderStoreSupplierDate/addOrderStoreSupplierDate";
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
        "RESULT OF ADD NEW orderStoreSupplierDate=" + JSON.stringify(result.data)
      );
      return result.data;
    }
    return null;
  }
  