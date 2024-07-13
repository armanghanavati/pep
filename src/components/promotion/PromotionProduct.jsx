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
import {
  addSlaPromotionDetail,
  updateSlaPromotionDetail,
} from "../../redux/reducers/promotion/promotion-action";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { useDispatch } from "react-redux";

const PromotionProduct = ({
  editProductRow,
  productList,
  itsEditProductRow,
  setProductList,
  showAddProduct,
  handleGetProductList,
  setInputFields,
  allProduct,
  setShowAddProduct,
  handleChangeInputs,
  inputFields,
  allgroupProduct,
  setAllgroupProduct,
  detailRow,
}) => {
  const [toast, setToast] = useState({});
  const dispatch = useDispatch();
  const filterProductGroup = allgroupProduct?.filter((item) => {
    return item?.id === inputFields?.productGroup;
  });

  const filterProduct = allProduct?.filter((item) => {
    return item?.id === inputFields?.product;
  });

  const handleGroupProductList = asyncWrapper(async () => {
    const res = await groupProductList();
    const { data, status, message } = res;
    if (status == "Success") {
      setAllgroupProduct(data);
      console.log(data);
    } else {
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message || "لطفا دوباره امتحان کنید",
          Type: status,
        })
      );
    }
  });

  useEffect(() => {
    handleGroupProductList();
    if (itsEditProductRow) {
      setInputFields((...prev) => {
        return {
          ...prev,
          productGroup: editProductRow?.data?.itemGroupName,
          product: editProductRow?.data?.itemName,
          discount: editProductRow?.data?.discount,
        };
      });
    }
    // else {
    //   setInputFields((...prev) => ({
    //     ...prev,
    //     productGroup: {},
    //     product: {},
    //     discount: "",
    //   }));
    // }
  }, []);

  // const handleSubmitProduct = async () => {
  //   const postData = {
  //     slapromotionId: editProductRow?.data?.id,
  //     itemId: inputFields?.product,
  //     discount: Number(inputFields?.discount),
  //     consumerPrice: null,
  //     priceWithDiscount: null,
  //   };
  //   if (itsEditProductRow) {
  //     const resUpdate = await updateSlaPromotionDetail(
  //       editProductRow?.data?.id,
  //       postData?.discount
  //     );
  //     handleGetProductList(detailRow?.data?.id);
  //     setShowAddProduct(false);
  //     console.log(resUpdate);
  //   } else {
  //     const resAdd = await addSlaPromotionDetail(postData);
  //     const { data, statusCode } = resAdd;
  //     if (statusCode === 200) {
  //       handleGetProductList(detailRow?.data?.id);
  //     }
  //   }
  // };
  // const columnsProduct = [
  //   {
  //     dataField: "barcode",
  //     caption: "بارکد‌ کالا",
  //     allowEditing: false,
  //   },
  //   {
  //     dataField: "itemGroupName",
  //     caption: "گروه‌ کالا",
  //     allowEditing: true,
  //   },
  //   {
  //     dataField: "itemName",
  //     caption: "نام‌ کالا",
  //     allowEditing: true,
  //   },
  //   {
  //     dataField: "discount",
  //     caption: "درصد‌تخفیف‌ کالا",
  //     allowEditing: true,
  //   },
  //   {
  //     caption: "عملیات",
  //     allowEditing: true,
  //     cellRender: (e) => {
  //       return (
  //         <>
  //           <DeleteIcon />
  //         </>
  //       );
  //     },
  //   },
  // ];

  const findBarcode = filterProduct?.[0]?.label?.split(" ");
  const getBarcode = findBarcode?.[findBarcode?.length - 1];
  const productItem = {
    productId: inputFields?.product,
    groupId: inputFields?.productGroup,
    itemName: filterProduct?.[0]?.label,
    barcode: getBarcode,
    discount: Number(inputFields?.discount),
    itemGroupName: filterProductGroup?.[0]?.label,
    code: null,
    id: productList.length + 1,
  };
  const handleCheckProductList = () => {
    const test = productList?.some((item) => {
      return (
        item?.productId === productItem?.productId &&
        item?.discount == productItem?.discount
      );
    });
    return test;
  };

  const handleSubmitProduct = () => {
    if (handleCheckProductList()) {
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: "این کالا با همین درصد تخفیف در لیست موجود است",
          Type: "Unsuccess",
        })
      );
    } else {
      setProductList((prev) => [...prev, productItem]);
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: "کالا با موفقیت به لیست اضافه شد",
          Type: "Success",
        })
      );
    }
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
            label="بستن"
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
            disabled={itsEditProductRow ? true : false}
            name="productGroup"
            onChange={(e) => handleChangeInputs("productGroup", e)}
            value={inputFields?.productGroup}
            options={allgroupProduct}
            xxl={6}
            xl={6}
            label="گروه کالا"
          />
          <ComboBox
            disabled={itsEditProductRow ? true : false}
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
