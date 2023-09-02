export async function locationList(comapnyId, Token){
    const url=window.apiAddress+"/Location/locationList?companyId=" + comapnyId;  
    const response = await fetch(
        url,
        {
            method: "GET",                        
            headers: { 
              'Content-Type': 'application/json' ,
              'Authorization': `Bearer ${Token}`
            },
        }
      );        
    const result= await response.json();
    if(result.status=="Success"){
      console.log('All location'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

export async function locationListOrderInventoryCombo(comapnyId, Token){
  const url=window.apiAddress+"/Location/locationListOrderInventoryCombo?companyId=" + comapnyId;  
  const response = await fetch(
      url,
      {
          method: "GET",                        
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('All location OrderInventory'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}

export async function locationOrderSupplierComboListByCompanyId(comapnyId, Token){
  const url=window.apiAddress+"/Location/locationOrderSupplierComboListByCompanyId?companyId=" + comapnyId;  
  const response = await fetch(
      url,
      {
          method: "GET",                        
          headers: { 
            'Content-Type': 'application/json' ,
            'Authorization': `Bearer ${Token}`
          },
      }
    );        
  const result= await response.json();
  if(result.status=="Success"){
    console.log('All location OrderSupplier'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}

export async function addLocation(Object,Token){
  const url=window.apiAddress+"/Location/addLocation"              
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
    console.log('RESULT OF ADD NEW Location='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function updateLocation(Object, Token){
  const url=window.apiAddress+"/Location/updateLocation"              
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
    console.log('Location update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return 0; 
}

export async function deleteLocation(locationId, Token){
  const url=window.apiAddress+"/Location/deleteLocation?locationId=" + locationId         
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
    console.log('Location delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}