export async function personList(companyId, Token) {
  const url = window.apiAddress + "/Person/personList?companyId=" + companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All person" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function personNoneAsignList(companyId, Token) {
  const url =
    window.apiAddress + "/Person/PersonNoneAsignList?companyId=" + companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All personNoneAsignList" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addPerson(Object, Token) {
  const url = window.apiAddress + "/Person/addPerson";
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
    console.log("RESULT OF ADD NEW person=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function updatePerson(Object, Token) {
  const url = window.apiAddress + "/Person/updatePerson";
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
    console.log("Person update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export async function deletePerson(personId, Token) {
  const url = window.apiAddress + "/Person/deletePerson?personId=" + personId;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("Person delete result=" + JSON.stringify(result.data));
    return result.message;
  }
  return 0;
}
