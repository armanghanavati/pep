export async function roleList(Token) {
  const url = window.apiAddress + "/Role/roleList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All role" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addRole(Object, Token) {
  const url = window.apiAddress + "/Role/addRole";
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
    console.log("RESULT OF ADD NEW role=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function updateRole(Object, Token) {
  const url = window.apiAddress + "/Role/updateRole";
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
    console.log("role update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export async function deleteRole(roleId, Token) {
  const url = window.apiAddress + "/Role/deleteRole?roleId=" + roleId;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Role delete result=" + JSON.stringify(result.data));
    return result.message;
  }
  return 0;
}
