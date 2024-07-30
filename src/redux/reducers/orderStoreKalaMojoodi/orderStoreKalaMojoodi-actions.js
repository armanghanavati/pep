export async function diffStockItemsWithSnapp(object, Token) {
    const url =
      window.apiAddress + "/OrdStoreKalaMojoodi/diffStockItemsWithSnapp?locationId=" + object.locationId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All Differnce Items With Snapp" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }