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