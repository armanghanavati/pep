export async function positionSupplierApproveOrderTime(locationId, positionId, supplierId, Token) {
    const url = window.apiAddress + "/PositionSupplierApproveOrderTime/positionSupplierApproveOrderTime?locationId=" + locationId + "&positionId=" + positionId + "&supplierId=" + supplierId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All position supplier approve orderTime" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addPositionSupplierApproveOrderTime(Object, Token) {
    const url = window.apiAddress + "/PositionSupplierApproveOrderTime/addPositionSupplierApproveOrderTime";
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
      console.log("RESULT OF ADD NEW position supplier approve order time=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }