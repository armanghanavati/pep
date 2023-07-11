
// export async function fetchSubjectData(Token){
//     const url=window.apiAddress+"/TicketSubject/ticketSubjectList"            
//     const response = await fetch(
//         url,
//         {
//             method: "GET",              
//             headers: { 
//               'Content-Type': 'application/json' ,
//               'Authorization': `Bearer ${Token}`
//             },
//         }
//       );        
//     const result= await response.json();
//     // console.log(JSON.stringify(result.data));
//     return result.data;
// }; 


export async function RegisterNewTicket(Object,Token){
  const url=window.apiAddress+"/Ticket/addTicket"              
  const response = await fetch(
      url,
      {
          method: "POST",              
          body:JSON.stringify(Object),
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    // console.log('New Ticket Insert'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}

export async function getAllUserInsertTicket(UserId,Token){
  // UserId=2
  const url=window.apiAddress+"/Ticket/userTicketList?userId="+UserId  
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
  if(result.status=="Success"){
    console.log('All Ticket'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}

export async function getTicketDetail(TicketId,Token){  
  const url=window.apiAddress+"/Ticket/ticketDetailList?parentId="+TicketId  
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
  console.log(response.statusText);  
  console.log(response.status);  
  const result= await response.json();      
  if(response.status==200){        
    console.log('Ticket Detail='+JSON.stringify(result.data));                 
    return result.data;  
  }    
  // return null;
}


export async function updateTicket(object,Token){  
  const url=window.apiAddress+"/Ticket/updateTicketStatus";  
  const response = await fetch(
      url,
      {
          method: "PATCH",
          body :JSON.stringify(object),
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  // console.log('result='+JSON.stringify(result));
  if(result.status=="Success"){
    console.log('ticket Updated='+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}








// export const fetchSubjecthData = async () => {    
//     return async (dispatch) => {
//         alert('tets')
//       const fetchHandler = async () => {
//         const url=window.apiAddress+"/TicketSubject/ticketSubjectList"        
//         const token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMTEwIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiIzIiwianRpIjoiYjRiYmZmYWEtZWQzNi00NjdjLWFhOWEtN2NlNGU5MDQ5N2RiIiwiZXhwIjoxNjg3ODk3MDY0LCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUxMzkiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjUxMzkifQ.-T_6cQrKVBnKpd01BGRqk55FPXE4maDkIhhnPKQXFKc";
//         const response = await fetch(
//             url,
//             {
//                 method: "GET",              
//                 headers: { 
//                   'Content-Type': 'application/json' ,
//                   'Authorization': `Bearer ${token}`
//                 },
//             }
//           );        
//         const result= await response.json();
//         return result;
//       }; 

//       try {
//         const subjectData = await fetchHandler();
//         console.log(subjectData);
//         dispatch(ticketActions.setTicketSubjects(subjectData));
//       } catch (err) {
//         // dispatch(
//         //   uiActions.showNotification({
//         //     open: true,
//         //     message: "Sending Request Failed",
//         //     type: "error",
//         //   })
//         // );
//       }
//     };
//   };