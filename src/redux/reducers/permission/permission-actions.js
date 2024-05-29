export async function permissionList(Token) {
    const url = window.apiAddress + "/Permission/permissionList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All permission" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addPermission(Object, Token) {
    const url = window.apiAddress + "/Permission/addPermission";
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
      console.log("RESULT OF ADD NEW permission=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function updatePermission(Object, Token) {
    const url = window.apiAddress + "/Permission/updatePermission";
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
      console.log("Permission update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function deletePermission(permissionId, Token) {
    const url = window.apiAddress + "/Permission/deletePermission?permissionId=" + permissionId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("Permission delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }
  