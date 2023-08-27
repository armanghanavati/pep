export async function positionList(companyId, Token) {
  const url =
    window.apiAddress + "/Position/positionList?companyId=" + companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All position" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addPosition(Object, Token) {
  const url = window.apiAddress + "/Position/addPosition";
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
    console.log("RESULT OF ADD NEW position=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function updatePosition(Object, Token) {
  const url = window.apiAddress + "/Position/updatePosition";
  const response = await fetch(url, {
    method: "PATCH",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("position update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export async function deletePosition(positionId, Token) {
  const url =
    window.apiAddress + "/Position/deletePosition?positionId=" + positionId;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Position delete result=" + JSON.stringify(result.data));
    return result.message;
  }
  return 0;
}
