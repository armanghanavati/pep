export async function sEPPaymentList(statusCode, Token) {
    const url=window.apiAddress+"/SEPPayment/sEPPaymentList?statusCode=" + statusCode;    
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
    console.log(JSON.stringify(result.data));
    return result.data;  
  }

  export async function addSEPPayment(Object,Token){
    const url=window.apiAddress+"/SEPPayment/addSEPPaymen"              
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
      // console.log('New Ticket Insert'+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  export async function updateSEPPayment(Object, Token){
    const url=window.apiAddress+"/SEPPayment/updateSEPPayment"              
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
      //console.log('seppayment update'+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  export async function confirmSEPPaymentAndSendlink(Object, Token){
    const url=window.apiAddress+"/SEPPayment/sEPPaymentConfirmAndSendLink"              
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
      //console.log('seppayment update'+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }