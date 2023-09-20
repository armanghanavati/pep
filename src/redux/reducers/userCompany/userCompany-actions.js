export async function companyUserAccessList(userId, Token){
    const url=window.apiAddress+"/UserCompany/companyUserAccessList?userId=" + userId  
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
      console.log('All userCompany'+JSON.stringify(result.data));
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

export async function addUserCompany(Object,Token){
  const url=window.apiAddress+"/UserCompany/addUserCompany"              
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
    console.log('RESULT OF ADD NEW UserCompany='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function deleteUserCompany(userId, companyId, Token){
  const url=window.apiAddress+"/UserCompany/deleteUserCompany?userId=" + userId + "&companyId=" + companyId              
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
    console.log('user company delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}

export async function removeCompanyFromUser(userId, companyId, Token) {
    const url =
      window.apiAddress +
      "/userCompany/removeCompanyFromUser?userId=" +
      userId +
      "&companyId=" +
      companyId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("company delete result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function removeCompanyListFromUser(userId, object, Token) {
    const url =
      window.apiAddress + "/UserCompany/removeCompanyListFromUser?userId=" + userId;
    const response = await fetch(url, {
      method: "DELETE",
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("company delete result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }