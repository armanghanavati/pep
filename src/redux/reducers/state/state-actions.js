export async function stateList(Token) {
    const url =
      window.apiAddress + "/State/stateList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All state" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function stateListCombo(Token) {
    const url =
      window.apiAddress + "/State/stateListCombo";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All state" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }