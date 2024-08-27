import axios from "axios";

export async function locationPositionOrderNumberList(companyId, Token) {
  const url =
    window.apiAddress +
    "/LocationPositionOrderNumber/locationPositionOrderNumberList?companyId=" +
    companyId;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log(
      "All locationPositionOrderNumber" + JSON.stringify(result.data)
    );
    return result.data;
  }
  return null;
}

export async function addLocationPositionOrderNumber(Object, Token) {
  const url =
    window.apiAddress +
    "/LocationPositionOrderNumber/addLocationPositionOrderNumber";
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
    console.log(
      "RESULT OF ADD NEW locationPositionOrderNumber=" +
        JSON.stringify(result.data)
    );
    return result.data;
  }
  return null;
}

export async function updateLocationPositionOrderNumber(Object, Token) {
  const url =
    window.apiAddress +
    "/LocationPositionOrderNumber/updateLocationPositionOrderNumber";
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
    console.log(
      "LocationPositionOrderNumber update result=" + JSON.stringify(result.data)
    );
    return result.data;
  }
  return 0;
}

export async function deleteLocationPositionOrderNumber(
  locationId,
  positionId,
  supplier,
  Token
) {
  const url =
    window.apiAddress +
    "/LocationPositionOrderNumber/deleteLocationPositionOrderNumber?locationId=" +
    locationId +
    "&positionId=" +
    positionId +
    "&supplierId=" +
    supplier;
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${Token}`,
    },
  });
  const result = await response.json();
  if (result.status == "Success") {
    console.log(
      "LocationPositionOrderNumber delete result=" + JSON.stringify(result.data)
    );
    return result.message;
  }
  return 0;
}

// افزودن
export const insertLocationPositionOrderNumberGroup = async (postData) => {
  const url =
    window.apiAddress +
    `/LocationPositionOrderNumber/insertLocationPositionOrderNumberGroup`;
  const response = await axios.post(url, postData);
  return response?.data;
};

// ویرایش
export const updateLocationPositionOrderNumberGroup = async (postData) => {
  const url =
    window.apiAddress +
    `/LocationPositionOrderNumber/updateLocationPositionOrderNumberGroup`;
  const response = await axios.patch(url, postData);
  return response?.data;
};

// کپی
export const copyLocationPositionOrderNumberGroup = async (postData) => {
  const url =
    window.apiAddress +
    `/LocationPositionOrderNumber/copyLocationPositionOrderNumberGroup`;
  const response = await axios.post(url, postData);
  return response?.data;
};

// جستجو
export const selectLocationPositionOrderNumber = async (postData) => {
  const url =
    window.apiAddress +
    `/LocationPositionOrderNumber/selectLocationPositionOrderNumber`;
  const response = await axios.post(url, postData);
  return response?.data;
};

// حذف
// export const deleteLocationPositionSupplierOrderNumberGroup = async (
//   postData
// ) => {
//   const url =
//     window.apiAddress +
//     ``;
//   console.log(url, postData);
//   const response = await axios.delete(url, postData);
//   console.log(response);
//   return response?.data;
// };

export const deleteLocationPositionSupplierOrderNumberGroup = async (
  postData
) => {
  const url =
    window.apiAddress +
    "/LocationPositionOrderNumber/DeleteLocationPositionSupplierOrderNumberGroup";
  const result = await axios.delete(url, {
    headers: {
      "Content-Type": "application/json",
    },
    data: postData,
  });
  return result?.data;
};
