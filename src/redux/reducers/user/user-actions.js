export async function authUser(Object,Token){
    const url=window.apiAddress+"/User/authUser"              
    const response = await fetch(
        url,
        {
            method: "POST",              
            body:JSON.stringify(Object),
            headers: { 
              'Content-Type': 'application/json' ,              
            },
        }
      );        
    const result= await response.json();
    if(result.status=="Success"){
      console.log('User Authenticated='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }


  export async function checkPermission(permissions,permissionValue){    
    // permissions=this.props.User.permissions!=null && this.props.User.permissions.find(({ value }) => value === permissionValue)
    console.log(JSON.stringify(permissions));
    console.log(permissionValue);
    
    let result=permissions!=null ? permissions.find(({ value }) => value === permissionValue) : null
    console.log("ACCESS FINDED="+JSON.stringify(result))
    const rtn=result==null ? false : true;
    return rtn;
  }