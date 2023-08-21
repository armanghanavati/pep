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

export async function supplierOrderInventoryComboList(companyId,Token) {
  const url = window.apiAddress + "/Supplier/supplierOrderInventoryComboList?companyId="+companyId;
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

export async function updateSupplier(Object, Token) {
  const url = window.apiAddress + "/Supplier/updateSupplier";
  console.log(JSON.stringify(Object))
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
