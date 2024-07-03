import axios from "axios";

// لیست پروموشن ها
export const slaPromotionByUserIdList = async (id) => {
  const url = window.apiAddress + `/SlaPromotion/slaPromotionByUserIdList?userId=${id}`;
  const response = await axios.get(url);
  console.log(response);
  return response?.data;
};
