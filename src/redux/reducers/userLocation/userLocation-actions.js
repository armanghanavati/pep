export async function locationUserAccessList(userId, Token){
    const url=window.apiAddress+"/UserLocation/locationUserAccessList?userId=" + userId  
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
      console.log('All userLocation'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

// --------------Company List For Combo-------------------
export async function locationListCombo(Token){
  const url=window.apiAddress+"/UserLocation/userLocationListCombo"  
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
    console.log('All userLocation'+JSON.stringify(result.data));
    return result.data;  
  }
  return null;
}

export async function addUserLocation(Object,Token){
  const url=window.apiAddress+"/UserLocation/addUserLocation"              
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
    console.log('RESULT OF ADD NEW UserLocation='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

export async function deleteUserLocation(userId, locationId, Token){
  const url=window.apiAddress+"/UserLocation/deleteUserLocation?userId=" + userId + "&locationId=" + locationId              
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
    console.log('user location user delete result='+JSON.stringify(result.data));
    return result.message;  
  }
  return 0; 
}

export async function removeLocationFromUser(userId, locationId, Token) {
    const url =
      window.apiAddress +
      "/userLocation/removeLocationFromUser?userId=" +
      userId +
      "&locationId=" +
      locationId;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("location delete result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }
  
  export async function removeLocationListFromUser(userId, object, Token) {
    const url =
      window.apiAddress + "/UserLocation/removeLocationListFromUser?userId=" + userId;
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
      console.log("user location delete result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }

  export async function updateUserLocation(Object, Token) {
    const url = window.apiAddress + "/UserLocation/updateUserLocation";
    const response = await fetch(url, {
      method: "PATCH",
      body: JSON.stringify(Object),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("User Location update result=" + JSON.stringify(result.data));
      return result.data;
    }
    return 0;
  }