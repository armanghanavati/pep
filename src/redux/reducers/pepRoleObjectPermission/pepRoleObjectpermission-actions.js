export async function pepRoleObjectPermissionList(Token) {
  const url =
    window.apiAddress + "/PepRoleObjectPermission/pepRoleObjectPermissionList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All pepRoleObjectPermission" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addPepRoleObjectPermission(Object, Token) {
  const url =
    window.apiAddress + "/PepRoleObjectPermission/addPepRoleObjectPermission";
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
      "RESULT OF ADD NEW pepRoleObjectPermission=" + JSON.stringify(result.data)
    );
    return result.data;
  }
  return null;
}

export async function updatePepRoleObjectPermission(Object, Token) {
  const url =
    window.apiAddress +
    "/PepRoleObjectPermission/updatePepRoleObjectPermission";
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
    console.log(
      "PepRoleObjectPermission update result=" + JSON.stringify(result.data)
    );
    return result.data;
  }
  return 0;
}

export async function deletePepRoleObjectPermission(
  roleId,
  objectId,
  permissionId,
  Token
) {
  const url =
    window.apiAddress +
    "/PepRoleObjectPermission/deletePepRoleObjectPermission?roleId=" +
    roleId + "&objectId=" + objectId + "&permissionId=" + permissionId;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log(
      "PepRoleObjectPermission delete result=" + JSON.stringify(result.data)
    );
    return result.message;
  }
  return 0;
}
