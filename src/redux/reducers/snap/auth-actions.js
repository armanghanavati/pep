export async function snapAuthUser(Object, Token) {
    const url = window.snapAddress + "/token";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(Object),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("User Authenticated=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }