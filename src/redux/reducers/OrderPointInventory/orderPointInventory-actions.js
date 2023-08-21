//-------------OrderPointInventory By Location Supplier Item----------------------
export async function orderPintInventoryListByLSI(Object, Token){
    const url=window.apiAddress+"/OrderPointInventory/orderPintInventoryListByLSI"              
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
      console.log('OrderPointInventory='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }


//-------------OrderPointInventory EDIT----------------------
export async function updateGroupsOrderPointInventory(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/updateGroupsOrderPointInventory"              
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
    console.log('UpdateOrderPointInventory='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}