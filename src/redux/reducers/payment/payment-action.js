export async function allSEPPaymentList(userId, statusCode, Token) {
  const url=window.apiAddress+"/SEPPayment/allSEPPaymentList?userId=" + userId;    
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
  console.log('PAYMENT LIST='+JSON.stringify(result.data));
  return result.data;  
}

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
    console.log('PAYMENT LIST='+JSON.stringify(result.data));
    return result.data;  
  }

  export async function addSEPPayment(Object,Token){
    const url=window.apiAddress+"/SEPPayment/addSEPPayment"              
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
      console.log('RESULT OF ADD NEW Payment='+JSON.stringify(result.data));
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
      console.log('seppayment update result='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }

  export async function ConfirmSEPPaymentAndSendlink(Object, Token){
    const url=window.confirmPayment+"/SEPPayment/sEPPaymentConfirmAndSendLink"              
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
      console.log('Confirm PaymentRequest='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }