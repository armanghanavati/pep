export async function itemList(Token) {
    const url = window.apiAddress + "/Item/itemList";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All Items" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
}
  
//-------------ItemListCombo----------------------
export async function itemListCombo(Token) {
    const url = window.apiAddress + "/Item/itemListCombo";
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    });
    const result = await response.json();
    if (result.status == "Success") {
      console.log("All Items for combo" + JSON.stringify(result.data));
      return result.data;
    }
    return null;
}

//-------------ItemListCombo By Supplier Id----------------------
export async function itemListComboBySupplierId(Object, Token){
  const url=window.apiAddress+"/Item/itemListComboBySupplierId"              
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
    console.log('ItemListBy Supplier='+JSON.stringify(result.data));
    return result.data;  
  }
  return null; 
}

//-------------ItemList Remain By SupplierId----------------------
export async function itemListRemainBySupplierId(Object,Token) {
  const url = window.apiAddress + "/Item/itemListRemainBySupplierId?supplierId="+Object.SupplierId+"&locationId="+Object.LocationId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Items" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

//-------------ItemListCombo By ItemGroup----------------------
export async function itemListComboByItemGroupId(Object,Token) {
  const url = window.apiAddress + "/Item/itemListComboByItemGroupId?itemGroupId="+Object.ItemGroupId+"&locationId="+Object.LocationId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Items for combo" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}