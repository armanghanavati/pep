export async function companyList(Token){
    const url=window.apiAddress+"/Company/companyList"  
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
      console.log('All company'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

// --------------Company List For Combo-------------------
export async function companyListCombo(Token){
  const url=window.apiAddress+"/Company/companyListCombo"  
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
    console.log('All company'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}

export async function addCompany(Object,Token){
  const url=window.apiAddress+"/Company/addCompany"              
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
    console.log('RESULT OF ADD NEW Company='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function updateCompany(Object, Token){
  const url=window.apiAddress+"/Company/updateCompany"              
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
    console.log('company update result='+JSON.stringify(result.data));
    return result.data;  
  }
  return 0; 
}

export async function deleteCompany(companyId, Token){
  const url=window.apiAddress+"/Company/deleteCompany?companyId=" + companyId              
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
    console.log('company delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}