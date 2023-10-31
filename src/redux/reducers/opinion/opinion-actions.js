export async function addOpinion(Object,Token){
    const url=window.apiAddress+"/Opinion/addOpinion"              
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
      return result.message;  
    }
    return null;
  }