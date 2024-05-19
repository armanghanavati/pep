export async function searchBakhshnamehPositionByBakhshnamehIdList(bakhshnamehId, Token){
    const url=window.apiAddress+"/BakhshnamehPosition/searchBakhshnamehPositionByBakhshnamehIdList?bakhshnamehId=" + bakhshnamehId  
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
      console.log('All bakhshnamehType'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}