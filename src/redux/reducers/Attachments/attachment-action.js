export async function UploadFiles(Object,Token){
    const url=window.apiAddress+"/Ticket/addAttachment"  
    console.log('AttachedOBJ='+JSON.stringify(Object))       
    const formData = new FormData();   
        for (let i = 0; i < Object.AttachedFile.length; i++) {
            formData.append('formFile', Object.AttachedFile[i]);
          } 
    formData.append('attachmentId', Object.AttachmentId);
    formData.append('attachmentType', Object.AttachmentType);
    formData.append('attachmentName', Object.AttachmentName);        
    const response = await fetch(
        url,
        {
            method: "POST",              
            body:formData,
            headers: {               
              'Authorization': `Bearer ${Token}`
            },
        }
      );        
    const result= await response.json();
    if(result.status=="Success"){
      console.log('New Ticket Insert'+JSON.stringify(result.data));
      return result.data;  
    }
    return null;
}

export async function AttachmentList(Object,Token){
    const url=window.apiAddress+"/Ticket/attachmentList?attachId=" + Object.AttachmentId      
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