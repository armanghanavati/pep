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


  //-------------OrderPointInventory By Location----------------------
export async function orderPintInventoryListByLocation(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/orderPintInventoryListByLocation"              
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
//-------------OrderPointInventory report----------------------
export async function orderPointInventoryReport(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/orderPointInventoryReport"              
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
    console.log('OrderPointInventoryREPORT='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------OrderPointInventory out route report----------------------
export async function orderPointInventoryOutRouteReport(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/orderPointInventoryOutRouteReport"              
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
    console.log('OrderPointInventoryREPORT='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}
  
//-------------OrderPointInventory Out Rout----------------------
export async function orderIventoryOutRouteList(Token){
  const url=window.apiAddress+"/OrderPointInventory/orderIventoryOutRouteList"              
  const response = await fetch(
      url,
      {
          method: "GET",                        
          headers: {           
            "Content-Type": "application/json",  
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('OrderInventory Out Route='+JSON.stringify(result.data));
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


//-------------OrderPointInventory New Insert----------------------
export async function insertNewDataOrderPointInventory(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/insertNewDataOrderPointInventory"              
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
    console.log('new OrderPointInventory='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------OrderPointInventory New Group Insert----------------------
export async function insertNewDataGroupOrderPointInventory(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/insertNewDataGroupOrderPointInventory"              
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
    console.log('new OrderPointInventory='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------OrderPointInventory New Group Insert----------------------
export async function confirmOrderInventorySpecificRetailStore(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/confirmOrderInventorySpecificRetailStore"              
  const response = await fetch(
      url,
      {
          method: "POST",              
          body:JSON.stringify(Object),
          // body:Object,
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('confirm out route='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------OrderPointInventory New Group Insert----------------------
export async function confirmRejectOrderInventoryOutRoute(Object, Token){
  const url=window.apiAddress+"/OrderPointInventory/confirmRejectOrderInventoryOutRoute"              
  const response = await fetch(
      url,
      {
          method: "POST",              
          body:JSON.stringify(Object),
          // body:Object,
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('confirm out route='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}