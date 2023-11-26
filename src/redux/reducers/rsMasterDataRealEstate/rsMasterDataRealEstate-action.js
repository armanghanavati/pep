
export async function masterDataRealEstateList(Token) {
    const url = window.apiAddress + "/rsMasterDataRealEstate/masterDataRealEstateList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All REAL ESTATE MASTE DATA" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }