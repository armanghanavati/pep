
// export async function searchLocationSupplier(object, Token){
//     const url=window.apiAddress+`/BseLocationSupplierLimit/searchLocationSupplier?locationId=${object.locationId}&extSupplierId=${object.extSupplierId}`
//     const response = await fetch(
//         url,
//         {
//             method: "DELETE",              
//             headers: { 
//               'Content-Type': 'application/json' ,
//               'Authorization': `Bearer ${Token}`
//             },
//         }
//       );        
//     const result= await response.json();
//     if(result.status=="Success"){
//       console.log('searchLocationSupplier='+JSON.stringify(result.data));
//       return result.message;  
//     }
//     return 0; 
//   }


  export async function locationSupplierLimitList(Object,Token){
    const url=window.apiAddress+"/BseLocationSupplierLimit/locationSupplierLimitList"              
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
      console.log('LocationSupplierLimitList='+JSON.stringify(result.data));
      return result.data;  
    }
    return null; 
  }