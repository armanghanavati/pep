export async function ticketSubjectUserList(Token){
    const url=window.apiAddress+"/TicketSubjectUser/ticketSubjectUserList"            
    const response = await fetch(
        url,
        {
            method: "GET",              
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${Token}`
            },
        }
      );        
    const result= await response.json();
    console.log("TICKET SUBJECKT User="+JSON.stringify(result.data));
    return result.data;
  }; 
  
  export async function addTicketSubjectUser(Object, Token) {
    const url = window.apiAddress + "/TicketSubjectUser/addTicketSubjectUser";
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
      console.log("RESULT OF ADD NEW role=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }
  
  export async function updateTicketSubjectUser(Object, Token) {
    const url = window.apiAddress + "/TicketSubjectUser/updateTicketSubjectUser";
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
      console.log("ticket subject user update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function deleteTicketSubjectUser(userId, ticketSubjectId, Token) {
    const url = window.apiAddress + "/TicketSubjectUser/deleteTicketSubjectUser?userId=" + userId + "&ticketSubjectId=" + ticketSubjectId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("ticket subject user delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }