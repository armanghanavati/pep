import React, { useCallback, useEffect, useState } from "react";
import TableMultiSelect2 from "../common/Tables/TableMultiSelect2";
import { Col, Container, Form, Label, Row, Toast } from "reactstrap";
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
import { groupIds } from "../../redux/reducers/item/item-action";
import { useDispatch, useSelector } from "react-redux";
import {
  locationPromotionList,
  storeGroup,
} from "../../redux/reducers/location/location-actions";
import { slaCustomerGroupList } from "../../redux/reducers/customer/customer-action";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import { CheckBox } from "devextreme-react";
import DataSource from "devextreme/data/data_source";
import PromotionCommonDetail from "../common/PromotionCommonDetail";

const PromotionDetail = ({
  detailRow,
  handleGetAllList,
  itsEditRow,
  showDetail,
  handleShowDetail,
  promotionList,
  setShowDetail,
}) => {
  const { users } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [productList, setProductList] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [errors, setErrors] = useState({});
  const [inputFields, setInputFields] = useState({});
  const [editProductRow, setEditProductRow] = useState({});
  const [itsEditProductRow, setItsEditProductRow] = useState(false);
  const [allgroupProduct, setAllgroupProduct] = useState([]);
  const [typeAndPlatform, setTypeAndPlatform] = useState({});
  const [selectedType, setSelectedType] = useState([]);
  const [selectStore, setSelectStore] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);

  const handleIdForList = (data, postProps, id) => {
    const dataFixed = data?.map((item) => {
      console.log(data, postProps, id, item);
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

  const handleChangeInputs = (
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
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });
    console.log(name, value);
  };

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

  const handleGetProductList = asyncWrapper(async (id) => {
    dispatch(RsetIsLoading({ stateWait: true }));
    if (itsEditRow) {
      const res = await itemPromotionList(id);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      const fixIdToItemId = data?.map((item) => {
        console.log(item, "item item item itemsssss");
        return {
          itemId: item?.itemId || item?.id,
          barcode: item?.barcode,
          code: item?.code,
          discount: item?.discount,
          itemGroupName: item?.itemGroupName,
          itemName: item?.itemName,
        };
      });
      if (status == "Success") {
        setProductList(fixIdToItemId);
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

  const fixMapProduct = (itemId, discount, id) => {
    const fixData = productList?.map((item) => {
      console.log(item, itemId, discount, id);
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

  const handleAcceptPromotion = asyncWrapper(async () => {
    console.log(handleIdForList(typeAndPlatform?.store, "bseLocationId"));
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
        typeAndPlatform?.type,
        "slaPromotionPlatformId"
      ),
      accLocationPromotions: handleIdForList(
        typeAndPlatform?.store,
        "bseLocationId"
      ),
      slaPromotionCustomerGroups: handleIdForList(
        typeAndPlatform?.customer,
        "slaCustomerGroupId"
      ),
    };
    const updatePromotion = {
      id: detailRow?.data?.id,
      daysOfferOld: inputFields?.daysOfferOld,
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
        typeAndPlatform?.type || selectedType,
        "slaPromotionPlatformId",
        detailRow?.data?.id
      ),
      accLocationPromotion: handleIdForList(
        typeAndPlatform?.store || selectStore,
        "bseLocationId",
        detailRow?.data?.id
      ),
      slaPromotionCustomerGroups: handleIdForList(
        typeAndPlatform?.customer || selectedCustomer,
        "slaCustomerGroupId",
        detailRow?.data?.id
      ),
    };

    if (itsEditRow) {
      dispatch(RsetIsLoading({ stateWait: true }));
      const res = await updateSlaPromotion(updatePromotion);
      dispatch(RsetIsLoading({ stateWait: false }));
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
    } else {
      dispatch(RsetIsLoading({ stateWait: true }));
      const res = await addSlaPromotion(postAddPromotion);
      dispatch(RsetIsLoading({ stateWait: false }));
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
    }
  });

  const columnsProduct = [
    {
      dataField: "barcode",
      caption: "بارکد‌ کالا",
      allowEditing: true,
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
      allowEditing: true,
      cellRender: (item) => {
        return <>{item?.key?.discount + "%"}</>;
      },
    },
  ];

  useEffect(() => {
    handleGetProductList(detailRow?.data?.id);
  }, []);

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
        <PromotionCommonDetail
          handleChangeInputs={handleChangeInputs}
          typeAndPlatform={typeAndPlatform}
          setTypeAndPlatform={setTypeAndPlatform}
          setProductList={setProductList}
          errors={errors}
          inputFields={inputFields}
          setInputFields={setInputFields}
          setShowDetail={setShowDetail}
          handleGetAllList={handleGetAllList}
          detailRow={detailRow}
          itsEditRow={itsEditRow}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectStore={selectStore}
          setSelectStore={setSelectStore}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
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
            allListRF={productList}
            allowDeleting
            // allowEditing
            headerFilter
            allowUpdating
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
          handleChangeInputs={handleChangeInputs}
          showAddProduct={showAddProduct}
          setShowAddProduct={setShowAddProduct}
          inputFields={inputFields}
          allgroupProduct={allgroupProduct}
          setAllgroupProduct={setAllgroupProduct}
        />
      )}
    </Modal>
  );
};

export default PromotionDetail;
