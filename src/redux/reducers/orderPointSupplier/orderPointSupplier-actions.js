//-------------OrderPointSupplier By Location Supplier Item----------------------
export async function orderPointSupplierListByLSI(Object, Token){
    const url=window.apiAddress+"/OrderPointSupplier/orderPointSupplierListByLSI"              
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
      console.log('OrderPointSupplier='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  
  //-------------TransferOrderPointSupplierToKyan By Location Supplier ----------------------
export async function transferOrderPointSupplierToKyan(Object, Token){
  const url=window.apiAddress+"/OrderPointSupplier/transferOrderPointSupplierToKyan"              
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
    console.log('OrderPointSupplier CONFIRM='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}


  //-------------OrderPointSupplier By Location Supplier ----------------------
  export async function orderPointSupplierListByLocationSupplier(Object, Token){
    const url=window.apiAddress+"/OrderPointSupplier/orderPointSupplierListByLocationSupplier"              
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
      console.log('OrderPointSupplier='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  //-------------OrderPointSupplier EDIT----------------------
export async function updateGroupsOrderPointSupplier(Object, Token){
  const url=window.apiAddress+"/OrderPointSupplier/updateGroupsOrderPointSupplier"              
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
    console.log('UpdateOrderPointSupplier='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------OrderPointSupplier New Insert----------------------
export async function insertNewDataOrderPointSupplier(Object, Token){
  const url=window.apiAddress+"/OrderPointSupplier/insertNewDataOrderPointSupplier"              
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
    console.log('new OrderPoint Supplier='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}



//-------------OrderPointSupplier New Group Insert----------------------
export async function insertNewDataGroupOrderPointSupplier(Object, Token){
  const url=window.apiAddress+"/OrderPointSupplier/insertNewDataGroupOrderPointSupplier"              
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
    console.log('new OrderPointSupplier='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------OrderPointSupplier report----------------------
export async function orderSupplierReport(Object, Token){
  const url=window.apiAddress+"/orderPointSupplier/orderPointSupplierReport"              
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
    console.log('new OrderPointSupplier='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}