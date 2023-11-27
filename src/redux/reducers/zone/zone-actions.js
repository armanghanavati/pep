export async function zoneList(Token) {
    const url = window.apiAddress + "/Zone/zoneList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All zone" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function addZone(Object,Token){
    const url=window.apiAddress+"/Zone/addZone"              
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
      console.log('RESULT OF ADD NEW zone='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }
  
  export async function updateZone(Object, Token){
    const url=window.apiAddress+"/Zone/updateZone"              
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
      console.log('zone update result='+JSON.stringify(result.data));
      return result.data;  
    }
    return 0; 
  }
  
  export async function deleteZone(zoneId, Token){
    const url=window.apiAddress+"/Zone/deleteZone?zoneId=" + zoneId              
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
      console.log('zone delete result='+JSON.stringify(result.data));
      return result.message;  
    }
    return 0; 
  }