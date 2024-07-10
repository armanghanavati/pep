import axios from "axios";

// گروه مشتری
export const slaCustomerGroupList = async (Id = 0) => {
  const url =
    window?.apiAddress +
    `/SlaCustomerGroup/slaCustomerGroupList?slaPromotionId=${Id}`;
  const response = await axios.get(url);
  return response?.data;
};
