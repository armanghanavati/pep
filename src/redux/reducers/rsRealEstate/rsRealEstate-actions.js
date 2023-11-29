
export async function addrsRealEstate(Object, Token) {
    const url = window.apiAddress + "/rsRealEstate/addrsRealEstate";
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
      console.log("RESULT OF ADD NEW RealEstate=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }