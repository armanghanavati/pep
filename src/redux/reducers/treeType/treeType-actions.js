export async function treeTypeList(Token) {
    const url = window.apiAddress + "/TreeType/treeTypeList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All treeType" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addPepObject(Object, Token) {
    const url = window.apiAddress + "/PepObject/addPepObject";
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
      console.log("RESULT OF ADD NEW pepObject=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function updatePepObject(Object, Token) {
    const url = window.apiAddress + "/PepObject/updatePepObject";
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
      console.log("PepObject update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function deletePepObject(PepObjectId, Token) {
    const url = window.apiAddress + "/PepObject/deletePepObject?PepObjectId=" + PepObjectId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("PepObject delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }
  