export async function locationTypeList(Token) {
    const url=window.apiAddress+"/LocationType/locationTypeList";    
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
    console.log('LocationType LIST='+JSON.stringify(result.data));
    return result.data;  
  }
  
  
    export async function addLocationType(Object,Token){
      const url=window.apiAddress+"/LocationType/AddLocationType"              
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
        console.log('RESULT OF ADD NEW Payment='+JSON.stringify(result.data));
        return result.data;  
      }
      return null; 
    }
  
    export async function updateLocationType(Object, Token){
      const url=window.apiAddress+"/LocationType/updateLocationType"              
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
        console.log('seppayment update result='+JSON.stringify(result.data));
        return result.data;  
      }
      return null; 
    }