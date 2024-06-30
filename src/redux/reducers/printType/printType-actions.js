export async function printTypeList(Token) {
    const url = window.apiAddress + "/PrintType/printTypeList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All print type" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }