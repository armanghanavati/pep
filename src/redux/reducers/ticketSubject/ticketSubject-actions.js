
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