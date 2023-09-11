export async function inventoryListByLocationId(Object, Token){
    const url=window.apiAddress+"/Inventory/inventoryListByLocationId" 
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
      console.log('All inventory'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

export async function addInventory(Object,Token){
  const url=window.apiAddress+"/Inventory/addInventory"              
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
    console.log('RESULT OF ADD NEW Inventory='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function updateInventory(Object, Token){
  const url=window.apiAddress+"/Inventory/updateInventory"              
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
    console.log('inventory update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return 0; 
}

export async function deleteInvnetory(inventoryId, Token){
  const url=window.apiAddress+"/Inventory/deleteInventory?inventoryId=" + inventoryId              
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
    console.log('inventory delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}