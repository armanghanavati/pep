export async function questionTypeUserList(Token) {
    const url = window.apiAddressInspection + "/QuestionTypeUser/questionTypeUserList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All question type user" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function addQuestionTypeUser(Object, Token) {
    const url = window.apiAddressInspection + "/QuestionTypeUser/addQuestionTypeUser";
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
      console.log("RESULT OF ADD NEW question type user=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function deleteQuestionTypeUser(userId, questionTypeId, Token) {
    const url =
      window.apiAddressInspection + "/QuestionTypeUser/deleteQuestionTypeUser?userId=" + userId + "&questionTypeId=" + questionTypeId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("Question type user delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }

  export async function updateQuestionTypeUser(Object, Token){
    const url=window.apiAddressInspection+"/questionTypeUser/updateQuestionTypeUser"              
    const response = await fetch(
        url,
        {
            method: "PATCH",              
            body:JSON.stringify(Object),
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${Token}`
            },
        }
      );        
    const result= await response.json();
    if(result.status=="Success"){
      console.log('QuestionTypeUser update result='+JSON.stringify(result.data));
      return result.data;  
    }
    return 0; 
  }



  