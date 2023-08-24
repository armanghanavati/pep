//-------------ItemGroup List Combo----------------------
export async function itemGroupListCombo(Token) {
    const url = window.apiAddress + "/ItemGroup/itemGroupComboList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All ItemGroup for combo" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
}