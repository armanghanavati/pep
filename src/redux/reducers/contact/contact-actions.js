export async function contactList(Token) {
    const url =
      window.apiAddress + "/Contact/contactList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All contact" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }