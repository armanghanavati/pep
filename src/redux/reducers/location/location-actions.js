import axios from "axios";

export async function locationList(comapnyId, Token) {
  const url =
    window.apiAddress + "/Location/locationList?companyId=" + comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All location" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function locationOrderSupplierComboListByCompanyId(
  comapnyId,
  Token
) {
  const url =
    window.apiAddress +
    "/Location/locationOrderSupplierComboListByCompanyId?companyId=" +
    comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All location OrderSupplier" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function addLocation(Object, Token) {
  const url = window.apiAddress + "/Location/addLocation";
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
    console.log("RESULT OF ADD NEW Location=" + JSON.stringify(result.data));
    return result.data;
  }
}

// ----------------------------------------------------------------------------------------
export async function locationListOrderInventoryCombo(comapnyId, Token) {
  const url =
    window.apiAddress +
    "/Location/locationListOrderInventoryCombo?companyId=" +
    comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All location OrderInventory" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function locationListOrderInventoryComboNew(comapnyId, Token) {
  const url =
    window.apiAddress +
    "/Location/locationListComboOPINew?companyId=" +
    comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("LOCATION FOR NEW Group" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function locationListOrderInventoryComboNewOutRoute(
  comapnyId,
  Token
) {
  const url =
    window.apiAddress +
    "/Location/locationListComboOPINewOutRoute?companyId=" +
    comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All location OrderInventory" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function locationListOrderSupplierComboNew(comapnyId, Token) {
  const url =
    window.apiAddress +
    "/Location/locationListComboOPSNew?companyId=" +
    comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("LOCATION FOR NEW OrderSupplier" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function locationListOrderSupplierComboNewOutRoute(
  comapnyId,
  Token
) {
  const url =
    window.apiAddress +
    "/Location/locationListComboOPSNewOutRoute?companyId=" +
    comapnyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All location OrderSupplier" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ----------------------------------------------------------------------------------------
export async function updateLocation(Object, Token) {
  const url = window.apiAddress + "/Location/updateLocation";
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
    console.log("Location update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

// ----------------------------------------------------------------------------------------
export async function deleteLocation(locationId, Token) {
  const url =
    window.apiAddress + "/Location/deleteLocation?locationId=" + locationId;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Location delete result=" + JSON.stringify(result.data));
    return result.message;
  }
  return 0;
}

// ----------------------------------------------------------------------------------------
export async function location(locationId, Token) {
  const url =
    window.apiAddress + "/Location/SearchLocationById?locationId=" + locationId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("location" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function allLocation(Token) {
  const url = window.apiAddress + "/Location/allLocation";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All location" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function locationByUserId(userId, Token) {
  const url =
    window.apiAddress + "/Location/searchLocationByUserId?userId=" + userId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("location by user Id" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// گروه فروشگاه
export const storeGroup = async (userId, comapnyId) => {
  const url =
    window.apiAddress +
    `/User/userLocationListCombo?userId=${userId}&companyId=${comapnyId}`;
  const response = await axios.get(url);
  return response?.data;
};

// گروه فروشگاه2
export const locationPromotionList = async (userId, permitionId) => {
  const url =
    window.apiAddress +
    `/Location/locationPromotionList?promotionId=${permitionId}&userId=${userId}`;
  const response = await axios.get(url);
  console.log(response);
  return response?.data;
};
