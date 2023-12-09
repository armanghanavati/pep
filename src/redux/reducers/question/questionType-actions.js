export async function questionTypeList(userId, Token) {
    const url = window.apiAddress + "/QuestionType/questionTypeList?userId=" + userId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All questionType" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function allQuestionType(Token) {
    const url = window.apiAddress + "/QuestionType/AllQuestionType";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All questionType" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }