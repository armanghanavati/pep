export async function locationPositionOrderNumberList(companyId, Token) {
    const url = window.apiAddress + "/PepObject/pepObjectList?companyId=" + companyId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All locationPositionOrderNumber" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addLocationPositionOrderNumber(Object, Token) {
    const url = window.apiAddress + "/LocationPositionOrderNumber/addLocationPositionOrderNumber";
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
      console.log("RESULT OF ADD NEW locationPositionOrderNumber=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function updatePepObject(Object, Token) {
    const url = window.apiAddress + "/LocationPositionOrderNumber/updateLocationPositionOrderNumber";
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
      console.log("LocationPositionOrderNumber update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function deletLocationPositionOrderNumber(locationId, positionId, Token) {
    const url = window.apiAddress + "/LocationPositionOrderNumber/deleteLocationPositionOrderNumber?locationId=" + locationId + "&positionId=" + positionId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("LocationPositionOrderNumber delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }
  