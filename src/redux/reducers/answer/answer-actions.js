export async function answerList(userId, type, Token) {
  const url =
    window.apiAddressInspection + "/Answer/answerList?userId=" + userId + "&type=" + type;
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
  const url = window.apiAddressInspection + "/Answer/addAnswer";
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
    window.apiAddressInspection + "/Answer/SearchAnswerById?answerId=" + answerId;
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

export async function confirmAnswer(Object, Token){
  const url=window.apiAddressInspection+"/Answer/confirmAnswer"            
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
    console.log('answer confirm update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return 0; 
}

export async function deleteAnswer(answerId, Token){
  const url=window.apiAddressInspection+"/Answer/deleteAnswer?answerId=" + answerId              
  const response = await fetch(
      url,
      {
          method: "DELETE",              
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('Answer delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}

export async function updateAnswer(Object, Token){
  const url=window.apiAddressInspection+"/Answer/updateAnswer"              
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
    console.log('Answer update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return 0; 
}