export async function answerList(userId, Token) {
  const url =
    window.apiAddress + "/Answer/answerList?userId=" + userId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All answer" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function addAnswer(Object, Token) {
  const url = window.apiAddress + "/Answer/addAnswer";
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
    console.log("RESULT OF ADD NEW answer=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function answerListById(answerId, Token) {
  const url =
    window.apiAddress + "/Answer/SearchAnswerById?answerId=" + answerId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All answer by id" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}