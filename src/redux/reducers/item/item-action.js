import axios from "axios";

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
export async function itemListComboBySupplierId(Object, Token) {
  const url = window.apiAddress + "/Item/itemListComboBySupplierId";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("ItemListBy Supplier=" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

//-------------ItemList Remain By SupplierId----------------------
export async function itemListRemainBySupplierId(Object, Token) {
  const url =
    window.apiAddress +
    "/Item/itemListRemainBySupplierId?supplierId=" +
    Object.SupplierId +
    "&locationId=" +
    Object.LocationId;
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

//-------------ItemListCombo By ItemGroup without Location----------------------
export async function itemListComboByItemGroupWithAll(Object, Token) {
  const url =
    window.apiAddress +
    "/Item/itemListComboByItemGroupWithAll?itemGroupId=" +
    Object.ItemGroupId;
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

//-------------ItemListCombo By Id----------------------
export async function itemListById(Object, Token) {
  // const url = window.apiAddress + "/Item/itemListById?itemId="+Object.ItemId;
  // const response = await fetch(url, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${Token}`,
  //   },
  // });
  // const result = await response.json();
  // if (result.status == "Success") {
  //   console.log("Item Founded" + JSON.stringify(result.data));
  //   return result.data;
  // }
  // return null;

  const url = window.apiAddress + "/Item/itemListById";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(Object),
    headers: {
      "Content-Type": "application/json",
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

//-------------ItemListCombo By ItemGroup----------------------
export async function itemListComboByItemGroupId(Object, Token) {
  const url =
    window.apiAddress +
    "/Item/itemListComboByItemGroupId?itemGroupId=" +
    Object.ItemGroupId +
    "&locationId=" +
    Object.LocationId;
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

//-------------ItemListCombo By ItemGroupToSupplier----------------------
export async function itemListComboByItemGroupIdToSupplier(Object, Token) {
  const url =
    window.apiAddress +
    "/Item/itemListComboByItemGroupIdToSupplier?itemGroupId=" +
    Object.ItemGroupId +
    "&locationId=" +
    Object.LocationId;
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

//-------------update Item Weight Pack----------------------
export async function updateItemWeightPack(Object, Token) {
  const url = window.apiAddress + "/Item/updateItemWeightPack";
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
    console.log("Item update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

//-------------update Item SSTID----------------------
export async function updateItemSSTID(Object, Token) {
  const url = window.apiAddress + "/Item/updateItemSSTID";
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
    console.log("Item update result=" + JSON.stringify(result.data));
    return result.data;
  }
  return 0;
}

export async function itemListComboByItemGroupIds(object, Token) {
  const url = window.apiAddress + "/Item/itemListComboByItemGroupIds";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Items by ItemGroupId" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function itemPromotionList(object, Token) {
  const url = window.apiAddress + "/Item/itemPromotionList";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All item promotion list" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function promotionNameList(Token) {
  const url = window.apiAddress + "/Item/promotionNameList";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All promotion Name list" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

export async function itemListByItemGroupIds(object, Token) {
  const url = window.apiAddress + "/Item/itemListByItemGroupIds";
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(object),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log("All Items by ItemGroupId" + JSON.stringify(result.data));
    return result.data;
  }
  return null;
}

// کالا
export const groupIds = async (object) => {
  console.log(object, window.apiAddress);
  const url = window.apiAddress + "/Item/itemListComboByItemGroupIds";
  const response = await axios.post(url, object);
  console.log(response);
  return response?.data;
};

// گروه کالا
export const groupProductList = async () => {
  const url = window.apiAddress + "/ItemGroup/itemGroupComboList";
  const response = await axios(url, {
    method: "GET",
  });
  return response?.data;
};

// جستجوی لیست کالا
export const slaPromotionList = async (object) => {
  const url = window.apiAddress + "/item/itemDiscountList";
  const response = await axios.post(url, object);
  console.log(response);
  return response?.data;
};

// صرویس گروه کالا برای 
export const itemComboByItemGroupIdList = async (object) => {
  const url = window.apiAddress + "/Item/itemComboByItemGroupIdList";
  const response = await axios.post(url, object);
  console.log(response);
  return response?.data;
};


