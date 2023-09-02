//-------------LogsOrderPointSupplier By By UserId Current Date----------------------
export async function logsOPSTodayListByUserId(data, Token){
    const url=window.apiAddress+"/LogsOrderPointSupplier/logsOPSTodayListByUserId?userId="+data
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
      console.log('LogsOrderPointSupplier='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  //-------------LogsOrderPointSupplier By OrderpointSupplierId----------------------
  export async function logsOPSByOPSid(data, Token){
    const url=window.apiAddress+"/LogsOrderPointSupplier/logsOPSByOPSid?orderPointSupplierId="+data
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
      console.log('LogsOrderPointSupplier='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }