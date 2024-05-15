export async function snpOrderList(obj, Token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderList";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("snpOrder List" + JSON.stringify(result.data));
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
  console.log("ACCEPT ORDER=" + JSON.stringify(result.data));
  if (result.status == "Success") {
    console.log("ACCEPT ORDER=" + JSON.stringify(result.data));
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
    console.log("Reject" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function itemJetList(object, token) {
  const url =
    window.apiAddress + "/OrdItemJet/itemJetList";
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

export async function snpOrderReport(object, token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderReport";
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


export async function snpOrderFinalConfirmSendOrder(object, Token) {
  const url =
    window.apiAddress + "/SnpOrder/snpOrderFinalConfirmSendOrder?orderId=" + object.orderId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();  
  if (result.status == "Success") {
    console.log("FInal COnfirm Order=" + JSON.stringify(result.jsonString));
    return result.jsonString;
  }
  return null;
}
