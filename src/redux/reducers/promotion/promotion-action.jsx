import axios from "axios";

// لیست پروموشن ها
export const slaPromotionByUserIdList = async (id) => {
  const url =
    window?.apiAddress + `/SlaPromotion/slaPromotionByUserIdList?userId=${id}`;
  const response = await axios.get(url);
  return response?.data;
};

// اقلام پروموشن
export const itemPromotionList = async (id) => {
  console.log(id);
  const url = window?.apiAddress + `/Item/itemPromotionList?promotionId=${id}`;
  const response = await axios.get(url);
  return response?.data;
};

// لیست نوع پروموشن
export const slaPromotionTypeList = async () => {
  const url = window?.apiAddress + `/SlaPromotionType/slaPromotionTypeList`;
  const response = await axios.get(url);
  return response?.data;
};

// لیست دسته پروموشن
export const slaPromotionPlatformList = async (id) => {
  const url =
    window?.apiAddress +
    `/SlaPromotionPlatform/slaPromotionPlatformList?promotionId=${id}`;
  const response = await axios.get(url);
  return response?.data;
};

// افزودن پروموشن
export const addSlaPromotion = async (data) => {
  const url = window?.apiAddress + `/SlaPromotion/addSlaPromotion`;
  const response = await axios.post(url, data);
  return response?.data;
};

// افزودن اقلام
export const addSlaPromotionDetail = async (data) => {
  const url = window?.apiAddress + `/SlaPromotionDetail/addSlaPromotionDetail`;
  const response = await axios.post(url, data);
  return response?.data;
};
