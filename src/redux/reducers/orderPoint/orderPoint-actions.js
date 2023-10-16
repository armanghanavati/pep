//-------------OrderPoint By Location Supplier Item----------------------
export async function orderPointListByLSI(Object, Token){
    const url=window.apiAddress+"/OrderPoint/orderPointListByLSI"              
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
      console.log('OrderPoint='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  //-------------OrderPoint update----------------------
export async function orderPointUpdate(Object, Token){
    const url=window.apiAddress+"/OrderPoint/orderPointUpdate"              
    const response = await fetch(
        url,
        {
            method: "PUT",              
            body:JSON.stringify(Object),
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${Token}`
            },
        }
      );        
    const result= await response.json();
    if(result.status=="Success"){
      console.log('update OrderPoint='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }