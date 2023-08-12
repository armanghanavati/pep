export async function supplierList(Token){
    const url=window.apiAddress+"/Supplier/supplierList"  
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
      console.log('All Supplier'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}