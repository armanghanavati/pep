export async function questionList(questionTypeId, Token) {
    const url = window.apiAddressInspection + "/Question/questionList?questionTypeId=" + questionTypeId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All question" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function addQuestion(Object, Token) {
    const url = window.apiAddressInspection + "/Question/addQuestion";
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
      console.log("RESULT OF ADD NEW question=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function updateQuestion(Object, Token) {
    const url = window.apiAddressInspection + "/Question/updateQuestion";
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
      console.log("question update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function deleteQuestion(questionId, Token) {
    const url =
      window.apiAddressInspection + "/Question/deleteQuestion?questionId=" + questionId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("Question delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }

  export async function notAnsweredQuestionList(answerId, userId, questionTypeId, Token) {
    const url = window.apiAddressInspection + "/Question/notAnsweredQuestionList?answerId=" + answerId + "&userId=" + userId + "&questionTypeId=" + questionTypeId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All notAnsweredQuestionList" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function answeredQuestionList(answerId, questionTypeId, zoneId, Token) {
    const url = window.apiAddressInspection + "/Question/answeredQuestionList?answerId=" + answerId + "&questionTypeId=" + questionTypeId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All answeredQuestionList" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function questionNumber(questionTypeId, Token) {
    const url =
      window.apiAddressInspection + "/Question/questionNumber?questionTypeId=" + questionTypeId;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("Question number result=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  