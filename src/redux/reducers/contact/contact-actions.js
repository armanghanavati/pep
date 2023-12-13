export async function ContactListForSupplier(Token) {
    const url =
      window.apiAddress + "/Contact/ContactListForSupplier";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All contact" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
  }

  export async function addContact(Object,Token){
    const url=window.apiAddress+"/Contact/addContact"              
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
      console.log('RESULT OF ADD NEW Contact='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }
  
  export async function updateContact(Object, Token){
    const url=window.apiAddress+"/Contact/updateContact"              
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
      console.log('contact update result='+JSON.stringify(result.data));
      return result.data;  
    }
    return 0; 
  }
  
  export async function deleteContact(contactId, Token){
    const url=window.apiAddress+"/Contact/deleteContact?contactId=" + contactId              
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
      console.log('contact delete result='+JSON.stringify(result.data));
      return result.message;  
    }
    return 0; 
  }