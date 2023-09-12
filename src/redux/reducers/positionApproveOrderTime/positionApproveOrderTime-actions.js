export async function positionApproveOrderTime(locationId, positionId, Token) {
    const url = window.apiAddress + "/PositionApproveOrderTime/positionApproveOrderTime?locationId=" + locationId + "&positionId=" + positionId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All position approve orderTime" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addPositionApproveOrderTime(Object, Token) {
    const url = window.apiAddress + "/PositionApproveOrderTime/addPositionApproveOrderTime";
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
      console.log("RESULT OF ADD NEW position approve order time=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }