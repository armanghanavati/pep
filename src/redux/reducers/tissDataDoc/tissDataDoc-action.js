import { postActionByFetch } from "../actions";

export async function tissDataDocList(object,Token){  
    const URL=window.apiAddress+"/TissDataDoc/tissDataDocList";  
    const RESULT=await postActionByFetch(URL,object,Token)
    console.log('TissDataDoc_Result='+JSON.stringify(RESULT));    
    if(RESULT.status=="Success"){      
      return RESULT.data;  
    }  
    return null;  
}