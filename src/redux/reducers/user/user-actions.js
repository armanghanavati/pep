import axios from "axios";

export async function authUser(Object, Token) {
  const url = window.apiAddress + "/User/authUser";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const result = await response.json();
  var rtnOBJ = {
    status: result.status,
    data: result.data,
    msg: result.message,
  };
  // if (result.status == "Success") {
  //   console.log("User Authenticated=" + JSON.stringify(result.data));
  //   return result.data;
  // }
  return rtnOBJ;
}
// --------------------------------------------------------------------------------------------
export async function checkPermission(permissions, permissionValue) {
  // permissions=this.props.User.permissions!=null && this.props.User.permissions.find(({ value }) => value === permissionValue)
  console.log(JSON.stringify(permissions));
  console.log(permissionValue);

  let result =
    permissions != null
      ? permissions.find(({ value }) => value === permissionValue)
      : null;
  console.log("ACCESS FINDED=" + JSON.stringify(result));
  const rtn = result == null ? false : true;
  return rtn;
}
// --------------------------------------------------------------------------------------------
export async function userList(Token) {
  const url = window.apiAddress + "/User/userList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All user" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
// --------------------------------------------------------------------------------------------
export async function addUser(Object, Token) {
  const url = window.apiAddress + "/User/addUser";
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
    console.log("RESULT OF ADD NEW user=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
// --------------------------------------------------------------------------------------------
export async function updateUser(Object, Token) {
  const url = window.apiAddress + "/User/updateUser";
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
    console.log("User update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}
// --------------------------------------------------------------------------------------------
export async function deleteUser(userId, Token) {
  const url = window.apiAddress + "/User/deleteUser?userId=" + userId;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("User delete result=" + JSON.stringify(result.data));
    return result.message;
  }
  return 0;
}
// --------------------------------------------------------------------------------------------
export async function userLocationList(userId, companyId, Token) {
  const url =
    window.apiAddress +
    "/User/userLocationList?userId=" +
    userId +
    "&companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All userLocation" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
// --------------------------------------------------------------------------------------------

export async function roleAsignToUser(Object, Token) {
  const url = window.apiAddress + "/User/roleAsignToUser";
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
    console.log("role asign to user=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
// --------------------------------------------------------------------------------------------
export async function userRoleList(userId, Token) {
  const url = window.apiAddress + "/User/userRoleList?userId=" + userId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("UserRole result=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
// --------------------------------------------------------------------------------------------
export async function removeRoleFromUser(userId, roleName, Token) {
  const url =
    window.apiAddress +
    "/User/removeRoleFromUser?userId=" +
    userId +
    "&roleName=" +
    roleName;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Role delete result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}
// --------------------------------------------------------------------------------------------
export async function removeRoleListFromUser(userId, object, Token) {
  const url =
    window.apiAddress + "/User/removeRoleListFromUser?userId=" + userId;
  const response = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Role delete result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export async function userLocationListCombo(userId, companyId, Token) {
  const url =
    window.apiAddress +
    "/User/userLocationListCombo?userId=" +
    userId +
    "&companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All userLocationCombo" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function SearchUserById(userId, Token) {
  const url = window.apiAddress + "/User/searchUserById?userId=" + userId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("User" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}
// --------------------------------------------------------------------------------------------
export async function updateProfile(Object, Token) {
  const url = window.apiAddress + "/User/updateProfile";
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
    console.log("Profile update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export const userLocationListComboByUserId = async (userId, companyId) => {
  const url =
    window.apiAddress +
    "/User/userLocationListCombo?userId=" +
    userId +
    "&companyId=" +
    companyId;
  const response = await axios.get(url);
  return response?.data;
};

// all location without add
export const userLocationListUserId = async (userId) => {
  const url =
    window.apiAddress +
    "/Location/locationByLocationPositionOrderNumberList?userId=" +
    userId;
  const response = await axios.get(url);
  return response?.data;
};
