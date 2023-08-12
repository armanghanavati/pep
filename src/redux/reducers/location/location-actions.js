export async function locationList(Token){
    const url=window.apiAddress+"/Location/locationList"  
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
      //console.log('All company'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

export async function addLocation(Object,Token){
  const url=window.apiAddress+"/Location/addLocation"              
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
    console.log('RESULT OF ADD NEW Location='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function updateLocation(Object, Token){
  const url=window.apiAddress+"/Location/updateLocation"              
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
    console.log('Location update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}