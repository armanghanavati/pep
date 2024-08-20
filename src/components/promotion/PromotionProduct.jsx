import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import Input from "../common/Inputs/Input";
import ComboBox from "../common/ComboBox";
import { Row } from "reactstrap";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { useDispatch, useSelector } from "react-redux";
import {
  groupProductList,
  itemComboByItemGroupIdList,
} from "../../redux/reducers/item/item-action";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import asyncWrapper from "../../utiliy/asyncWrapper";
import DataSource from "devextreme/data/data_source";
import Validation from "../../utiliy/validations";
import StringHelpers from "../../utiliy/GlobalMethods";

const PromotionProduct = ({
  inputFields,
  editProductRow,
  productList,
  itsEditProductRow,
  setProductList,
  showAddProduct,
  handleGetProductList,
  setShowAddProduct,
  allgroupProduct,
  setAllgroupProduct,
  detailRow,
}) => {
  const [questionModal, setQuestionModal] = useState(false);
  const { main } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [inputsProduct, setInputsProduct] = useState({});
  const [errors, setErrors] = useState({});
  const [allProduct, setAllProduct] = useState(null);

  const filterProductGroup = allgroupProduct?.filter((item) => {
    return item?.id === inputsProduct?.productGroup;
  });

  const permitForNextStep = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (let key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputFields[item] === undefined ||
        inputFields[item] === null ||
        JSON.stringify(inputFields[item])?.trim() === ""
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const filterProduct = allProduct?.filter((item) => {
    return item?.id === inputsProduct?.product;
  });

  const handleChangeInputsProduct = (
    name,
    value,
    validationNameList = undefined,
    index
  ) => {
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    setErrors((prevstate) => {
      return { ...prevstate, [name]: [...temp] };
    });
    setInputsProduct((prevstate) => {
      return { ...prevstate, [name]: value };
    });

    if (name === "productGroup") {
      setInputsProduct((prev) => ({
        ...prev,
        discount: "",
      }));
      if (value === 0) {
        const fixLoop = StringHelpers.fixComboListId(
          inputsProduct?.productGroup,
          allgroupProduct
        );
        return handleGroupIds(fixLoop);
      } else {
        return handleGroupIds([value]);
      }
    }
  };

  const handleGroupIds = asyncWrapper(async (e) => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await itemComboByItemGroupIdList(e);
    dispatch(RsetIsLoading({ stateWait: false }));

    const { data, status, message } = res;
    if (status === "Success") {
      const LAZY = new DataSource({
        store: data,
        paginate: true,
        pageSize: 10,
      });

      setAllProduct(data);
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

  const handleGroupProductList = asyncWrapper(async () => {
    const res = await groupProductList();
    const { data, status, message } = res;
    if (status === "Success") {
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
    if (!itsEditProductRow) {
      setInputsProduct((prev) => ({
        ...prev,
        productGroup: editProductRow?.data?.itemGroupName,
        product: editProductRow?.data?.itemName,
        discount: editProductRow?.data?.discount,
      }));
    } else {
      setInputsProduct((prev) => ({
        ...prev,
        productGroup: {},
        product: {},
        discount: "",
      }));
    }
  }, []);

  const findBarcode = filterProduct?.[0]?.label?.split(" ");
  const getBarcode = findBarcode?.[findBarcode?.length - 1];
  const productItem = {
    productId: inputsProduct?.product || "",
    groupId: inputsProduct?.productGroup || "",
    itemName: filterProduct?.[0]?.label || "",
    barcode: getBarcode || "",
    discount: Number(inputsProduct?.discount) || "",
    itemGroupName: filterProductGroup?.[0]?.label || "",
    code: null,
    id: productList.length + 1,
  };

  const handleCheckProductList = () => {
    const test = productList?.some((item) => {
      return item?.productId === productItem?.productId;
    });
    return test;
  };

  const handleAcceptProduct = () => {
    console.log(inputsProduct);
    const index = productList.findIndex(
      (item) => item?.productId === productItem?.productId
    );
    if (index !== -1) {
      const newProducts = [...productList];
      newProducts.splice(index, 1, productItem);
      console.log(newProducts);
      setProductList([...newProducts]);
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: "کالا با موفقیت جایگزین شد",
          Type: "Success",
        })
      );
      setQuestionModal(false);
    }
  };

  const handleSubmitProduct = () => {
    console.log("DDDDDDDDDDDDDD");
    if (handleCheckProductList()) {
      setQuestionModal(true);
    } else {
      setProductList((prev) => [...prev, productItem]);
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: "کالا با موفقیت به لیست اضافه شد",
          Type: "Success",
        })
      );
      // setShowAddProduct(false);
    }
  };

  const handleQuestionToAccept = () => {
    // if (permitForNextStep(["productGroup", "product", "discount"]) === true) {
    // console.log("DDDDDDDDDDDDDD");
    handleSubmitProduct();
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
            onClick={handleQuestionToAccept}
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
            onChange={handleChangeInputsProduct}
            value={inputsProduct?.productGroup}
            options={allgroupProduct}
            xxl={6}
            xl={6}
            label="گروه کالا"
          />
          <ComboBox
            name="product"
            onChange={handleChangeInputsProduct}
            value={inputsProduct?.product}
            options={allProduct}
            xxl={6}
            xl={6}
            label="کالا"
          />
          <Input
            name="discount"
            maxLength={3}
            label="درصد تخفیف"
            type="number"
            xxl={6}
            className="my-3"
            onChange={handleChangeInputsProduct}
            value={inputsProduct?.discount}
          />
        </Row>
      </Modal>
      {questionModal && (
        <Modal
          size="sm"
          classHeader="bg-white"
          isOpen={questionModal}
          footerButtons={[
            <Button
              text="Outlined"
              stylingMode="outlined"
              type="danger"
              onClick={() => setQuestionModal(false)}
              label="لغو"
            />,
            <Button
              className=""
              onClick={handleAcceptProduct}
              text="success"
              stylingMode="success"
              type="success"
              label="تایید"
            />,
          ]}
        >
          <div className="d-flex justify-content-center mb-3">
            <ReportProblemIcon className="text-danger font45" />
          </div>
          یک کالا مشابه به همین کالا در لیست اقلام وجود دارد. آیا تمایل به
          جایگزین آن کالا را دارید؟
        </Modal>
      )}
    </>
  );
};

export default PromotionProduct;

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
