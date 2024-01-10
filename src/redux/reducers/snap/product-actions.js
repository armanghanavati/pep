export async function snapProduct(Object, Token) {
    const url = window.snapAddress + "/product/productDetails";
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
      console.log("User Authenticated=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }