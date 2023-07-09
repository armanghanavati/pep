export async function Login(UserName,Password){
    
    // const url=window.apiAddress+"/TicketPriority/ticketPriorityList";
    // const response = await fetch(url);    
    // const data = await response.json();    
    // return data;


    const authOBJ={
        username:UserName,
        password:Password
    }
    const url=window.apiAddress+"/User/authUser";
    const response = await fetch(
        url,
        {
          method: "POST",
          body: JSON.stringify(authOBJ),
          headers: { 'Content-Type': 'application/json' },
        }
      );        
    const data= await response.json();

    return data;

    // await fetch(url,{
    //     method:'GET'        
    // })
    // .then((response) => response.json())
    //     .then((responseJson)=>{                  
    //         return responseJson;
    // })
    // .catch((error)=>{              
    //     console.error(error);
    // })         
}