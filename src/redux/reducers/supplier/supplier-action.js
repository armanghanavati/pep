import axios from "axios";

export async function supplierList(Token) {
  const url = window.apiAddress + "/Supplier/supplierList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Supplier" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function supplierOrderInventoryComboList(companyId, Token) {
  const url =
    window.apiAddress +
    "/Supplier/supplierOrderInventoryComboList?companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Supplier COMBO" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function supplierComboListByCompanyId(companyId, Token) {
  const url =
    window.apiAddress +
    "/Supplier/supplierComboListByCompanyId?companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Supplier COMBO" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function supplierComboListByUserId(companyId, Token) {
  const url =
    window.apiAddress +
    "/Supplier/supplierComboListByUserId?companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Supplier COMBO" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function supplierOrderSupplierComboList(companyId, Token) {
  const url =
    window.apiAddress +
    "/Supplier/supplierOrderSupplierComboList?companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Supplier COMBO" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function supplierListComboByItemId(Object, Token) {
  const url =
    window.apiAddress +
    "/Supplier/supplierListComboByItemId?itemId=" +
    Object.ItemId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Supplier ByItem" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

//-----------------All Active Supplier Dor ComboBox------------------------
export async function activeSupplierComboList(Token) {
  const url = window.apiAddress + "/Supplier/activeSupplierComboList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Supplier" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addSupplier(Object, Token) {
  const url = window.apiAddress + "/Supplier/addSupplier";
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
    console.log("RESULT OF ADD NEW Supplier=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// ------------------------------------------------------------------------------------------------
export async function supplierListByExtIds(Object, Token) {
  const url = window.apiAddress + "/Supplier/supplierListByExtIds";
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
    console.log("Supplier List By ExtIds=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function updateSupplier(Object, Token) {
  const url = window.apiAddress + "/Supplier/updateSupplier";
  console.log(JSON.stringify(Object));
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
    console.log("Supplier update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function deleteSupplier(Object, Token) {
  const url = window.apiAddress + "/Supplier/deleteSupplier";
  const response = await fetch(url, {
    method: "DELETE",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Supplier delete result=" + JSON.stringify(result.data));
    return result.message;
  }
  return null;
}

export async function supplierListComboByCompanyId(companyId, Token) {
  const url =
    window.apiAddress +
    "/Supplier/supplierListComboByCompanyId?companyId=" +
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
    console.log("SupplierList combo result=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// تامین کننده
export const supplierLocationSupplierLimitListByLocationIds = async (
  postData
) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/supplierLocationSupplierLimitListByLocationIds`;
  const response = await axios.post(url, postData);
  return response?.data;
};

// لیست تامین کننده فروشگاه
export const allLocationSupplierLimitList = async () => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/allLocationSupplierLimitList`;
  const response = await axios.get(url);
  return response?.data;
};

// جستجوی تامین کننده بر اساس فروشگاه
export const searchLocationSupplierLimitList = async (postData) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/searchLocationSupplierLimitList`;
  const response = await axios.post(url, postData);
  return response?.data;
};

export const getAllSupplierComboList = async () => {
  const url = window?.apiAddress + `/Supplier/activeSupplierComboList`;
  const response = await axios.get(url);
  return response?.data;
};

// حذف تامین کننده و فروشگاه
export const deleteLocationSupplierLimitList = async (
  locationId,
  supplierId
) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/deleteLocationSupplierLimitList?locationId=${locationId}&supplierId=${supplierId}`;
  const response = await axios.delete(url);
  return response?.data;
};

// افزودن تامین کننده و فروشگاه
export const addLocationSupplierLimitList = async (postData) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/addLocationSupplierLimitList`;
  const response = await axios.post(url, postData);
  return response?.data;
};

// ویرایش تامین کننده و فروشگاه
export const updateLocationSupplierLimitList = async (postData) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/updateLocationSupplierLimitList`;
  const response = await axios.patch(url, postData);
  return response?.data;
};

export const supplierLocationSupplierLimitListByLocationId = async (
  locationId
) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/supplierLocationSupplierLimitListByLocationId?locationId=${locationId}`;
  const response = await axios.get(url);
  return response?.data;
};

// کپی تامین کنننده
export const copySupplierLocationSupplierLimitList = async (postData) => {
  const url =
    window?.apiAddress +
    `/BseLocationSupplierLimit/copySupplierLocationSupplierLimitList`;
  const response = await axios.post(url, postData);
  return response?.data;
};

export const insertSupplierListByCompany = async (companyId) => {
  const url =
    window?.apiAddress +
    `/Supplier/supplierListComboByCompanyId?companyId=${companyId}`;
  const response = await axios.get(url);
  return response?.data;
};

export const supplierByCompanyId = async () => {
  const url =
    window?.apiAddress + `/Supplier/supplierByLocationPositionOrderNumberList`;
  const response = await axios.get(url);
  return response?.data;
};
