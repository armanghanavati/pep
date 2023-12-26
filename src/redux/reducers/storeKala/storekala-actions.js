export async function storeKalamojoodiList(locationId, itemId,Token) {
    const url = window.apiAddress + "/StoreKalaMojoodi/storeKalaMojoodiByLocationAndItemIdList?locationId=" + locationId + "&itemId=" + itemId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All store kala mojoodi" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }