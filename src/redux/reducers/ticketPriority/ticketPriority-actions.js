
export async function fetchTicketPriorityData(Token){
    const url=window.apiAddress+"/TicketPriority/ticketPriorityList"            
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
    console.log(JSON.stringify(result.data));
    return result.data;
}; 