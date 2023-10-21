export async function fetchTicketSubjectData(Token){
    const url=window.apiAddress+"/TicketSubject/ticketSubjectList"            
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
    console.log("TICKET SUBJECKTS="+JSON.stringify(result.data));
    return result.data;
}; 

export async function ticketSubjectWithGroupList(Token){
  const url=window.apiAddress+"/TicketSubject/ticketSubjectWithGroupList"            
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
  console.log("TICKET SUBJECKT with group="+JSON.stringify(result.data));
  return result.data;
}; 

export async function addTicketSubject(Object, Token) {
  const url = window.apiAddress + "/TicketSubject/addTicketSubject";
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
    console.log("RESULT OF ADD NEW TicketSubject=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function updateTicketSubject(Object, Token) {
  const url = window.apiAddress + "/TicketSubject/updateTicketSubject";
  console.log(JSON.stringify(Object))
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
    console.log("TicketSubject update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export async function deleteTicketSubject(ticketSubjectId, Token) {
    const url = window.apiAddress + "/TicketSubject/deleteTicketSubject?ticketSubjectId=" + ticketSubjectId;
    const response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(Object),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("TicketSubject delete result=" + JSON.stringify(result.data));
      return result.message;
    }
    return 0;
  }

  export async function ticketSubjectParentList(Token) {
    const url = window.apiAddress + "/TicketSubject/ticketSubjectParentList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("TicketSubjectParentList result=" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }