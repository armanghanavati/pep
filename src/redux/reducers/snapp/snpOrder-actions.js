export async function snpOrderList(userId, Token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderList?userId=" + userId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All snp orders" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function snpOrderDetailList(orderId, Token) {
  const url =
    window.apiAddress + "/SnpOrderDetail/snpOrderDetailList?orderId=" + orderId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All snp order details" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function snpOrderAccept(object, token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderAccept";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("accept" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function snpOrderDeclineReasonList(vendorCode, Token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderDeclineReasonList?vendorCode=" + vendorCode;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Decline reason" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function snpOrderReject(object, token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderReject";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("accept" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}