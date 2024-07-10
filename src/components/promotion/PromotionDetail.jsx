import React, { useEffect, useState } from "react";
import { Col, Container, Label, Row, Toast } from "reactstrap";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import Input from "../common/Inputs/Input";
import Validation from "../../utiliy/validations";
import { TextField } from "@mui/material";
import DatePicker from "../common/DatePickers/DatePicker";
import SwitchCase from "../common/SwitchCases/SwitchCase";
import TableMultiSelect from "../common/Tables/TableMultiSelect";
import ComboBox from "../common/ComboBox";
import TextArea from "devextreme-react/text-area";
import Table from "../common/Tables/Table";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addSlaPromotion,
  itemPromotionList,
  slaPromotionPlatformList,
  slaPromotionTypeList,
  updateSlaPromotion,
} from "../../redux/reducers/promotion/promotion-action";
import asyncWrapper from "../../utiliy/asyncWrapper";
import CheckIcon from "@mui/icons-material/Check";
import PromotionProduct from "./PromotionProduct";
import StringHelpers from "../../utiliy/GlobalMethods";
import {
  groupIds,
  itemComboByItemGroupIdList,
} from "../../redux/reducers/item/item-action";
import { useDispatch, useSelector } from "react-redux";
import {
  locationPromotionList,
  storeGroup,
} from "../../redux/reducers/location/location-actions";
import { slaCustomerGroupList } from "../../redux/reducers/customer/customer-action";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";

const PromotionDetail = ({
  detailRow,
  handleGetAllList,
  itsEditRow,
  inputFields,
  setInputFields,
  showDetail,
  handleShowDetail,
  promotionList,
  setShowDetail,
}) => {
  const { users, companies } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [promotionTypeList, setPromotionTypeList] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [allgroupProduct, setAllgroupProduct] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [allPlatform, setAllPlatform] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [typeAndPlatform, setTypeAndPlatform] = useState({});
  const [editProductRow, setEditProductRow] = useState({});
  const [itsEditProductRow, setItsEditProductRow] = useState(false);
  const [toast, setToast] = useState({});
  const [allCustomer, setAllCustomer] = useState([]);
  const [productList, setProductList] = useState([]);

  const handleIdForList = (data, postProps, id) => {
    const dataFixed = data?.map((item) => {
      if (id) {
        return {
          slaPromotionId: id,
          [postProps]: item,
        };
      } else {
        return {
          [postProps]: item,
        };
      }
    });
    return dataFixed;
  };

  const fixMapProduct = (itemId, discount, id) => {
    const fixData = productList?.map((item) => {
      if (id) {
        return {
          slaPromotionId: id,
          [itemId]: item?.productId || item?.itemId,
          [discount]: item?.discount,
          consumerPrice: 0,
          priceWithDiscount: 0,
        };
      } else {
        return {
          [itemId]: item?.itemId || item?.productId,
          [discount]: item?.discount,
          consumerPrice: 0,
          priceWithDiscount: 0,
        };
      }
    });
    return fixData;
  };

  const handleChangeInputs = (
    name,
    value,
    validationNameList = undefined,
    index
  ) => {
    // if (name === "itsFromDate") {
    //   if (Validation.minimumDate(inputFields?.itsToDate, value) === true) {
    //     setErrors({
    //       ...errors,
    //       itsToDate: [],
    //     });
    //   } else {
    //     setErrors({
    //       ...errors,
    //       itsToDate: Validation.minimumDate(inputFields?.itsToDate, value),
    //     });
    //   }
    // } else if (name === "itsToDate") {
    //   if (Validation.maximumDate(inputFields?.itsFromDate, value) === true) {
    //     setErrors({
    //       ...errors,
    //       itsFromDate: [],
    //     });
    //   } else {
    //     setErrors({
    //       ...errors,
    //       itsFromDate: Validation.maximumDate(inputFields?.itsFromDate, value),
    //     });
    //   }
    // }
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
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });
    if (name === "productGroup" && !!value) {
      if (value === 0) {
        const fixLoop = StringHelpers.fixComboListId(
          inputFields?.productGroup,
          allgroupProduct
        );
        return handleGroupIds(fixLoop);
      } else {
        return handleGroupIds(value);
      }
    }
    console.log(name, value);
  };

  const handleGroupIds = asyncWrapper(async (e) => {
    const eventFix = [e];
    const res = await itemComboByItemGroupIdList(eventFix);
    const { data, status, message } = res;
    if (status == "Success") {
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

  const handleGetslaPromotionTypeList = asyncWrapper(async () => {
    const res = await slaPromotionTypeList();
    const { data, status, message } = res;
    if (status == "Success") {
      setPromotionTypeList(data);
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

  const handleSlaPromotionPlatformList = asyncWrapper(async (id) => {
    const res = await slaPromotionPlatformList(id);
    const { data, status, message } = res;
    if (status == "Success") {
      setAllPlatform(data);
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

  const handleGetProductList = asyncWrapper(async (id) => {
    if (itsEditRow) {
      const res = await itemPromotionList(id);
      const { data, status, message } = res;
      const fixIdToItemId = data?.map((item) => {
        return {
          itemId: item?.id,
          barcode: item?.barcode,
          code: item?.code,
          discount: item?.discount,
          itemGroupName: item?.itemGroupName,
          itemName: item?.itemName,
        };
      });
      if (status == "Success") {
        setProductList(fixIdToItemId);
        console.log(fixIdToItemId);
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
    } else {
      setProductList([]);
    }
  });

  const handleGroupStore = asyncWrapper(async () => {
    const res = await locationPromotionList(users?.userId, detailRow?.data?.id);
    const { data, status, message } = res;
    console.log(res);
    if (status == "Success") {
      setStoreList(data);
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

  const columnsProduct = [
    {
      dataField: "barcode",
      caption: "بارکد‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "itemGroupName",
      caption: "گروه‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "itemName",
      caption: "نام‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "discount",
      caption: "درصد‌تخفیف‌ کالا",
      allowEditing: false,
    },
  ];

  const platformColumns = [
    {
      dataField: "isChecked",
      caption: "",
      allowEditing: true,
    },
    {
      dataField: "code",
      caption: "کد‌",
      allowEditing: false,
    },
    {
      dataField: "platformName",
      caption: "عنوان",
      allowEditing: false,
    },
  ];

  const storeColumns = [
    {
      dataField: "isChecked",
      caption: "",
      allowEditing: true,
    },
    {
      dataField: "code",
      caption: "کد‌",
      allowEditing: false,
    },
    {
      dataField: "locationName",
      caption: "عنوان",
      allowEditing: false,
    },
  ];

  const customerColumns = [
    {
      dataField: "isChecked",
      caption: "",
      allowEditing: true,
    },
    {
      dataField: "code",
      caption: "کد‌",
      allowEditing: false,
    },
    {
      dataField: "customerGroupName",
      caption: "عنوان",
      allowEditing: false,
    },
  ];

  const handleGetDataEditFields = () => {
    if (itsEditRow) {
      const getEditRow = detailRow?.data;
      const fixEdit = {
        title: getEditRow?.title,
        isActive: getEditRow?.isActive,
        itsFromDate: getEditRow?.fromDate,
        itsToDate: getEditRow?.toDate,
        daysOffer: getEditRow?.daysOffer,
        typePromotion: getEditRow?.promotionTypeId,
        desc: getEditRow?.desc,
        code: getEditRow?.code,
      };
      setInputFields((prev) => ({ ...prev, ...fixEdit }));
    } else {
      setInputFields({});
    }
  };

  const handleAcceptGroup = () => {
    console.log(allPlatform);
    const fixAllPlatform = allPlatform
      ?.filter((platform) => platform?.isChecked === true)
      .map((item) => item.id);
    setTypeAndPlatform((prev) => ({ ...prev, fixAllPlatform }));
  };

  const handleAcceptStore = () => {
    const fixStoreList = storeList
      ?.filter((store) => store?.isChecked === true)
      .map((item) => item.id);
    setTypeAndPlatform((prev) => ({ ...prev, fixStoreList }));
  };

  const handleAcceptCustomer = () => {
    const fixAllCustomer = allCustomer
      ?.filter((store) => store?.isChecked === true)
      .map((item) => item.id);
    setTypeAndPlatform((prev) => ({ ...prev, fixAllCustomer }));
  };

  const handleAcceptPromotion = asyncWrapper(async () => {
    const postAddPromotion = {
      title: inputFields?.title,
      fromDate: StringHelpers?.convertDateEn(inputFields?.itsFromDate),
      toDate: StringHelpers?.convertDateEn(inputFields?.itsToDate),
      isActive: inputFields?.isActive,
      desc: inputFields?.desc,
      daysOffer: inputFields?.daysOffer,
      slaPromotionTypeId: inputFields?.typePromotion,
      slaPromotionDetails: fixMapProduct("itemId", "discount"),
      slaPromotionPlatformPromotions: handleIdForList(
        typeAndPlatform?.fixAllPlatform,
        "slaPromotionPlatformId"
      ),
      accLocationPromotions: handleIdForList(
        typeAndPlatform?.fixStoreList,
        "bseLocationId"
      ),
      slaPromotionCustomerGroups: handleIdForList(
        typeAndPlatform?.fixAllCustomer,
        "slaCustomerGroupId"
      ),
    };
    const updatePromotion = {
      id: detailRow?.data?.id,
      title: inputFields?.title,
      daysOffer: inputFields?.daysOffer,
      fromDate:
        typeof inputFields?.itsFromDate === "string"
          ? StringHelpers?.convertJalaliDateToGregorian(
              inputFields?.itsFromDate
            )
          : StringHelpers?.convertDateEn(inputFields?.itsFromDate),
      toDate:
        typeof inputFields?.itsToDate === "string"
          ? StringHelpers?.convertJalaliDateToGregorian(inputFields?.itsToDate)
          : StringHelpers?.convertDateEn(inputFields?.itsToDate),
      isActive: inputFields?.isActive,
      desc: inputFields?.desc,
      slaPromotionTypeId: inputFields?.typePromotion,
      slaPromotionDetails: fixMapProduct(
        "itemId",
        "discount",
        detailRow?.data?.id
      ),
      slaPromotionPlatformPromotions: handleIdForList(
        typeAndPlatform?.fixAllPlatform,
        "slaPromotionPlatformId",
        detailRow?.data?.id
      ),
      accLocationPromotions: handleIdForList(
        typeAndPlatform?.fixStoreList,
        "bseLocationId",
        detailRow?.data?.id
      ),
      slaPromotionCustomerGroups: handleIdForList(
        typeAndPlatform?.fixAllCustomer,
        "slaCustomerGroupId",
        detailRow?.data?.id
      ),
    };
    console.log(updatePromotion);
    if (itsEditRow) {
      const res = await updateSlaPromotion(updatePromotion);
      const { data, status, message } = res;
      if (status == "Success") {
        handleGetAllList();
        setShowDetail(false);
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
      console.log(res);
    } else {
      const res = await addSlaPromotion(postAddPromotion);
      const { data, status, message } = res;
      if (status == "Success") {
        handleGetAllList();
        setShowDetail(false);
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      } else {
        dispatch(
          RsetShowToast({
            isToastVisible: true,
            Message: message || "لطفا دوباره امتحان کنید",
            Type: status,
          })
        );
      }
      console.log(res);
    }
  });

  useEffect(() => {
    handleGetslaPromotionTypeList();
    handleSlaCustomerGroupList();
    handleSlaPromotionPlatformList(detailRow?.data?.id);
    handleGetProductList(detailRow?.data?.id);
    handleGroupStore();
    if (detailRow?.data?.id) {
      handleGetDataEditFields();
    }
  }, []);

  useEffect(() => {
    handleAcceptStore();
    handleAcceptCustomer();
    handleAcceptGroup();
  }, [allPlatform, storeList, allCustomer]);

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

  const handleQuestionToAcceptEdit = () => {
    if (permitForNextStep(["title", "itsFromDate", "itsToDate"]) === true) {
      handleAcceptPromotion();
    }
  };

  const handleEditRowProduct = (data) => {
    setShowAddProduct(true);
    setItsEditProductRow(true);
    setEditProductRow(data);
  };

  const handleSlaCustomerGroupList = asyncWrapper(async () => {
    const res = await slaCustomerGroupList(detailRow?.data?.id);
    const { data, status, message } = res;
    if (status == "Success") {
      setAllCustomer(data);
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

  return (
    <Modal
      size="xl"
      onClose={handleShowDetail}
      label="پروموشن"
      isOpen={showDetail}
      footerButtons={[
        <>
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowDetail(false)}
            label="لغو"
          />
          <Button
            onClick={handleQuestionToAcceptEdit}
            text="success"
            stylingMode="success"
            type="success"
            icon={<CheckIcon className="ms-1 font18 fw-bold" />}
            label="تایید"
          />
        </>,
      ]}
    >
      <Row className="d-flex">
        {/* <Input
          error={errors.code}
          validations={[["required"]]}
          xxl={4}
          className="my-3"
          name="code"
          onChange={handleChangeInputs}
          value={inputFields?.code}
          label="کد"
        /> */}
        <Input
          error={errors.title}
          validations={[["required"]]}
          xxl={4}
          className="my-3"
          name="title"
          onChange={handleChangeInputs}
          value={inputFields?.title}
          label="عنوان"
        />
        <DatePicker
          onChange={(e) => handleChangeInputs("itsFromDate", e)}
          name="itsFromDate"
          error={errors.itsFromDate}
          value={inputFields?.itsFromDate}
          className="my-3"
          minDate={Date.now()}
          xxl={4}
          validations={[["required", "maximumDate", inputFields?.itsToDate]]}
          label="از تاریخ"
        />
        <DatePicker
          minDate={Date.now()}
          name="itsToDate"
          value={inputFields?.itsToDate}
          validations={[["required", "minimumDate", inputFields?.itsFromDate]]}
          onChange={(e) => handleChangeInputs("itsToDate", e)}
          className="my-3"
          xxl={4}
          error={errors.itsToDate}
          label="تا تاریخ"
        />
        <Col className="d-flex justify-content-start" xxl={4} xl={12}>
          <TableMultiSelect
            submit={handleAcceptGroup}
            allListRF={allPlatform}
            columns={platformColumns}
            className="my-3"
            xxl={12}
            xl={2}
            label="دسته"
          />
        </Col>
        <Col className="d-flex justify-content-start" xxl={4} xl={12}>
          <TableMultiSelect
            submit={handleAcceptStore}
            allListRF={storeList}
            columns={storeColumns}
            className="my-3"
            xxl={12}
            xl={2}
            label="فروشگاه"
          />
        </Col>
        <Col className="d-flex justify-content-start" xxl={4} xl={12}>
          <TableMultiSelect
            submit={handleAcceptCustomer}
            allListRF={allCustomer}
            columns={customerColumns}
            className="my-3"
            xxl={12}
            xl={2}
            label="گروه مشتری"
          />
        </Col>
        <Input
          type="number"
          name="daysOffer"
          value={inputFields?.daysOffer}
          onChange={handleChangeInputs}
          maxLength={2}
          className="my-3"
          xxl={4}
          label="روز‌مجاز‌ ویرایش"
        />
        <ComboBox
          name="typePromotion"
          displayExpr="typeName"
          options={promotionTypeList}
          value={inputFields?.typePromotion}
          onChange={(e) => handleChangeInputs("typePromotion", e)}
          placeholder="نوع"
          label="نوع"
          className="my-3"
          xl={4}
          xxl={4}
        />
        <Col
          xl="4"
          xxl="4"
          className="d-flex mt-4 align-items-center justify-content-center"
        >
          <SwitchCase
            className="my-3"
            name="isActive"
            trueLabel="فعال"
            falseLabel="غیر فعال"
            onChange={(e) => handleChangeInputs("isActive", e.target.checked)}
            checked={inputFields?.isActive}
            switcher
            // value={inputFields?.isActive}
          />
        </Col>
        <Col className="my-3" xxl="12">
          <Label> توضیحات </Label>
          <TextArea
            name="desc"
            value={inputFields?.desc}
            onChange={(e) => handleChangeInputs("desc", e?.event?.target.value)}
            rtlEnabled
          />
        </Col>

        <Col xxl="11" className="">
          <Button
            onClick={() => {
              setItsEditProductRow(false);
              setShowAddProduct(true);
            }}
            icon={<AddIcon className="ms-1 fw-bold" />}
            text="success"
            stylingMode="success"
            type="success"
            label="افزودن کالا"
          />
        </Col>
        <Col xxl="12" className="">
          <Table
            onRowClick={handleEditRowProduct}
            allListRF={productList}
            allowDeleting
            columns={columnsProduct}
            filterRow
          />
        </Col>
      </Row>
      {showAddProduct && (
        <PromotionProduct
          productList={productList}
          detailRow={detailRow}
          itsEditProductRow={itsEditProductRow}
          setInputFields={setInputFields}
          editProductRow={editProductRow}
          handleGetProductList={handleGetProductList}
          setProductList={setProductList}
          allProduct={allProduct}
          handleChangeInputs={handleChangeInputs}
          showAddProduct={showAddProduct}
          setShowAddProduct={setShowAddProduct}
          inputFields={inputFields}
          allgroupProduct={allgroupProduct}
          setAllgroupProduct={setAllgroupProduct}
        />
      )}
      {/* {toast.isToastVisible && (
        <Toast
          visible={toast.isToastVisible}
          message={toast.Message}
          type={toast.Type}
          onHiding={() => setToast({ isToastVisible: false })}
          displayTime={10000}
          width={600}
          rtlEnabled={true}
        />
      )} */}
    </Modal>
  );
};

export default PromotionDetail;
