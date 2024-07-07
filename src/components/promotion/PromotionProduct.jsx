import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import Input from "../common/Inputs/Input";
import ComboBox from "../common/ComboBox";
import { Form, Label, Row, Toast } from "reactstrap";
import CheckIcon from "@mui/icons-material/Check";
import asyncWrapper from "../../utiliy/asyncWrapper";
import {
  groupIds,
  groupProductList,
  slaPromotionList,
} from "../../redux/reducers/item/item-action";
import Validation from "../../utiliy/validations";
import { addSlaPromotionDetail } from "../../redux/reducers/promotion/promotion-action";

const PromotionProduct = ({
  showAddProduct,
  handleGetPromotionList,
  setProductList,
  allProduct,
  setShowAddProduct,
  handleChangeInputs,
  inputFields,
  allgroupProduct,
  setAllgroupProduct,
  detailRow,
}) => {
  const [toast, setToast] = useState({});

  const handleGroupProductList = asyncWrapper(async () => {
    const res = await groupProductList();
    const { data, statusCode, RESULT } = res;
    if (statusCode == 200) {
      setAllgroupProduct(data);
    } else {
      setToast({
        ToastProps: {
          isToastVisible: true,
          Message: !!RESULT ? "ثبت با موفقیت انجام گردید" : "عدم ثبت",
          Type: !!RESULT ? "success" : "error",
        },
      });
    }
  });

  useEffect(() => {
    handleGroupProductList();
  }, []);

  const handleSubmitProduct = async () => {
    setShowAddProduct(false);
    const postData = {
      slapromotionId: detailRow?.data?.id,
      itemId: inputFields?.product,
      discount: Number(inputFields?.discount),
      consumerPrice: 10,
      priceWithDiscount: 10,
    };
    const res = await addSlaPromotionDetail(postData);
    const { data, statusCode } = res;
    if (statusCode === 200) {
      handleGetPromotionList();
    }
    console.log(res);
  };

  return (
    <>
      <Modal
        size="lg"
        label="افزودن کالا"
        isOpen={showAddProduct}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowAddProduct(false)}
            label="لغو"
          />,
          <Button
            className=""
            onClick={handleSubmitProduct}
            text="success"
            stylingMode="success"
            type="success"
            label="ذخیره"
          />,
        ]}
      >
        <Row>
          <ComboBox
            name="productGroup"
            onChange={(e) => handleChangeInputs("productGroup", e)}
            value={inputFields?.productGroup}
            options={allgroupProduct}
            xxl={6}
            xl={6}
            label="گروه کالا"
          />
          <ComboBox
            name="product"
            onChange={(e) => handleChangeInputs("product", e)}
            value={inputFields?.product}
            options={allProduct}
            xxl={6}
            xl={6}
            label="کالا"
          />
          <Input
            maxLength={2}
            label="درصد تخفیف"
            type="number"
            xxl={6}
            className="my-3"
            name="discount"
            onChange={handleChangeInputs}
            value={inputFields?.discount}
            // value={inputFields?.discount  "%"}
          />
        </Row>
        {toast.isToastVisible && (
          <Toast
            visible={toast.isToastVisible}
            message={toast.Message}
            type={toast.Type}
            onHiding={() => setToast({ isToastVisible: false })}
            displayTime={10000}
            width={600}
            rtlEnabled={true}
          />
        )}
      </Modal>
    </>
  );
};

export default PromotionProduct;
