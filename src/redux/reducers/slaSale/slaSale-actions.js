export async function finalConfirmPurchaseReceipt(Object, Token) {
    const url = window.apiAddress + "/SlaSale/finalConfirmPurchaseReceipt";
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
      console.log("finalConfirmPurchaseReceipt OK=" + result.message);
      return result.message;
    }
    return null;
  }