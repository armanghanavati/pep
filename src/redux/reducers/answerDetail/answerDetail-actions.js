export async function answerDetailList(answerId, Token) {
    const url =
      window.apiAddressInspection + "/AnswerDetail/answerDetailList?answerId=" + answerId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All answer detail" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function addAnswerDetail(Object, Token) {
    const url = window.apiAddressInspection + "/AnswerDetail/addAnswerDetail";
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

  export async function answerDetailReport(object, Token) {
    const url =
      window.apiAddressInspection + "/AnswerDetail/answerDetailReport";
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("Answer detail report" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }