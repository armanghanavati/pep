export async function bakhshnamehList(positionId, userId, type, Token){
    const url=window.apiAddress+"/Bakhshnameh/bakhshnamehList?positionId=" + positionId + "&userId=" + userId  + "&type=" + type
    const response = await fetch(
        url,
        {
            method: "GET",                        
            headers: {               
              'Authorization': `Bearer ${Token}`
            },
        }
      );        
    const result= await response.json();
    if(result.status=="Success"){
      console.log('All bakhshnameh'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

export async function addBakhshnameh(Object,Token){
  const url=window.apiAddress+"/Bakhshnameh/addBakhshnameh"              
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
    console.log('RESULT OF ADD NEW Bakhshnameh='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function updateBakhshnameh(Object, Token){
  const url=window.apiAddress+"/Bakhshnameh/updateBakhshnameh"              
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
    console.log('bakhshnameh update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return 0; 
}

export async function updateBakhshnamehStatus(Object, Token){
    const url=window.apiAddress+"/Bakhshnameh/updateBakhshnamehStatus"              
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
      console.log('bakhshnameh update result='+JSON.stringify(result.data));
      return result.data;  
    }
    return 0; 
  }

export async function deleteBakhshnameh(bakhshnamehId, Token){
  const url=window.apiAddress+"/Bakhshnameh/deleteBakhshnameh?bakhshnamehId=" + bakhshnamehId              
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
    console.log('bakhshnameh delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}

export async function bakhshnamehNoneReadList(positionId, userId, Token){
  const url=window.apiAddress+"/Bakhshnameh/bakhshnamehNoneReadList?positionId=" + positionId + "&userId=" + userId 
  const response = await fetch(
      url,
      {
          method: "GET",                        
          headers: {               
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('All bakhshnamehNoneReadList'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}