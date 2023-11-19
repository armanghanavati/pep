export async function zoneList(Token) {
    const url = window.apiAddress + "/Zone/zoneList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All zone" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }