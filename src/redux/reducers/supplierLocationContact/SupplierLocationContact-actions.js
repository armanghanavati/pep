export async function supplierLocationContactList(Token) {
    const url = window.apiAddress + "/SupplierLocationContact/supplierLocationContactList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All Supplier Location Contact" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  
  export async function addSupplierLocationContact(Object, Token) {
    const url = window.apiAddress + "/SupplierLocationContact/addSupplierLocationContact";
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
      console.log("RESULT OF ADD NEW Supplier Location Contact=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function deleteSupplierLocationContact(supplierId, locaitonId, contactId, Token) {
      const url = window.apiAddress + "/SupplierLocationContact/deleteSupplierLocationContact?supplierId=" + supplierId + "&locationId=" + locaitonId + "&contactId=" + contactId;
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      });
      const result = await response.json();
      if (result.status == "Success") {
        console.log("Supplier Location Contact delete result=" + JSON.stringify(result.data));
        return result.message;
      }
      return 0;
    }