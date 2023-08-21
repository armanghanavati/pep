//-------------LogsOrderPointInventory By By UserId Current Date----------------------
export async function logsOPITodayListByUserId(data, Token){
    const url=window.apiAddress+"/LogsOrderPointInventory/logsOPITodayListByUserId?userId="+data
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
      console.log('LogsOrderPointInventory='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }


  //-------------LogsOrderPointInventory By OrderpointInventoryId----------------------
export async function logsOPIByOPIid(data, Token){
    const url=window.apiAddress+"/LogsOrderPointInventory/logsOPIByOPIid?orderInventoryPointId="+data
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
      console.log('LogsOrderPointInventory='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }