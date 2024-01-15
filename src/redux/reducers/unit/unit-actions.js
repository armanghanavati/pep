export async function unitList(Token) {
    const url = window.apiAddressInspection + "/Unit/unitList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All unit" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }