// ----------------------GET ACTION By Fetch----------------------  
export async function getActionByFetch(url,object,token){
    // UserId=2
    // const url=window.apiAddress+"/Ticket/userTicketList" 
    const response = await fetch(
        url,
        {
            method: "GET",                        
            headers: {               
              'Authorization': `Bearer ${token}`
            },
        }
      );        
    const RESULT= await response.json();    
    return RESULT;
  }

// ----------------------POST ACTION By Fetch----------------------  
export async function postActionByFetch(url,object,token){  
    // const url=window.apiAddress+"/Ticket/tissDataDocList";  
    const response = await fetch(
        url,
        {
            method: "POST",
            body :JSON.stringify(object),
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${token}`
            },
        }
      );        
    const RESULT= await response.json();        
    return RESULT;
  }

// ----------------------PATH ACTION By Fetch----------------------  
export async function pathActionByFetch(url,object,token){      
    const response = await fetch(
        url,
        {
            method: "PATCH",
            body :JSON.stringify(object),
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${token}`
            },
        }
      );        
      const RESULT= await response.json();        
      return RESULT;
  }

// ----------------------PUT ACTION By Fetch----------------------  
export async function putActionByFetch(url,object,token){      
    const response = await fetch(
        url,
        {
            method: "PUT",
            body :JSON.stringify(object),
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${token}`
            },
        }
      );        
      const RESULT= await response.json();        
      return RESULT;
  }