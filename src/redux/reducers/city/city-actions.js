export async function cityList(stateId, Token) {
    const url = window.apiAddress + "/City/cityList?stateId=" + stateId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All city" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }