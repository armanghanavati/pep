export async function itemSupplierList(itemGroupId, supplierId,Token) {
    const url =
      window.apiAddress + "/ItemSupplier/itemSupplierList?itemGroupId=" + itemGroupId + "&supplierId=" + supplierId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All item supplier" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }   
  
  export async function updateItemSupplier(Object, Token) {
    const url = window.apiAddress + "/Item/updateItemSupplier";
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
      console.log("ItemSupplier update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  