import React, { useCallback, useEffect, useState } from "react";
import TableMultiSelect2 from "../../common/Tables/TableMultiSelect2";
import { Col, Container, Form, Label, Row, Toast } from "reactstrap";
import Modal from "../../common/Modals/Modal";
import Button from "../../common/Buttons/Button";
import Input from "../../common/Inputs/Input";
import Validation from "../../../utiliy/validations";
import { TextField } from "@mui/material";
import DatePicker from "../../common/DatePickers/DatePicker";
import SwitchCase from "../../common/SwitchCases/SwitchCase";
import TableMultiSelect from "../../common/Tables/TableMultiSelect";
import ComboBox from "../../common/ComboBox";
import TextArea from "devextreme-react/text-area";
import Table from "../../common/Tables/Table";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  addSlaPromotion,
  itemPromotionList,
  slaPromotionPlatformList,
  slaPromotionTypeList,
  updateSlaPromotion,
} from "../../../redux/reducers/promotion/promotion-action";
import asyncWrapper from "../../../utiliy/asyncWrapper";
import CheckIcon from "@mui/icons-material/Check";
import StringHelpers from "../../../utiliy/GlobalMethods";
import { groupIds } from "../../../redux/reducers/item/item-action";
import { useDispatch, useSelector } from "react-redux";
import {
  locationPromotionList,
  storeGroup,
} from "../../../redux/reducers/location/location-actions";
import { slaCustomerGroupList } from "../../../redux/reducers/customer/customer-action";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../../redux/reducers/main/main-slice";
import { CheckBox } from "devextreme-react";
import DataSource from "devextreme/data/data_source";

const PromotionCommonDetail = ({
  setShowDetail,
  handleChangeInputs,
  setProductList,
  itsEditRow,
  detailRow,
  handleGetAllList,
  inputFields,
  setInputFields,
  errors,
  typeAndPlatform,
  setTypeAndPlatform,
  selectedType,
  setSelectedType,
  selectStore,
  setSelectStore,
  selectedCustomer,
  setSelectedCustomer,
}) => {
  const { users } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [promotionTypeList, setPromotionTypeList] = useState([]);
  const [allPlatform, setAllPlatform] = useState([]);
  const [storeList, setStoreList] = useState([]);

  const [allCustomer, setAllCustomer] = useState([]);

  const handleGetslaPromotionTypeList = asyncWrapper(async () => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await slaPromotionTypeList();
    dispatch(RsetIsLoading({ stateWait: false }));
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
    dispatch(RsetIsLoading({ stateWait: true }));
    const fixId = itsEditRow ? detailRow?.data?.id : 0;
    const res = await slaPromotionPlatformList(fixId);
    dispatch(RsetIsLoading({ stateWait: false }));
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

  const handleGroupStore = asyncWrapper(async () => {
    const fixId = itsEditRow ? detailRow?.data?.id : 0;
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await locationPromotionList(users?.userId, fixId);
    dispatch(RsetIsLoading({ stateWait: false }));

    const { data, status, message } = res;
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

  const platformColumns = [
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
      dataField: "id",
      caption: "کد‌",
      allowEditing: false,
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
      console.log(getEditRow);
      const fixEdit = {
        daysOfferOld: getEditRow?.daysOffer,
        title: getEditRow?.title || "",
        isActive: getEditRow?.isActive || false,
        itsFromDate: getEditRow?.fromDate || "",
        itsToDate: getEditRow?.toDate || "",
        daysOffer: getEditRow?.daysOffer || "",
        typePromotion: getEditRow?.promotionTypeId || "",
        desc: getEditRow?.desc || "",
        code: getEditRow?.code || "",
      };
      setInputFields((prev) => ({ ...prev, ...fixEdit }));
    } else {
      setInputFields({
        title: "",
        isActive: false,
        itsFromDate: "",
        itsToDate: "",
        daysOffer: "",
        typePromotion: "",
        desc: "",
        code: "",
      });
    }
  };

  const handleSlaCustomerGroupList = asyncWrapper(async () => {
    const fixId = itsEditRow ? detailRow?.data?.id : 0;
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await slaCustomerGroupList(fixId);
    dispatch(RsetIsLoading({ stateWait: false }));
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

  const handleAcceptGroup = () => {
    setTypeAndPlatform((prev) => ({ ...prev, type: selectedType }));
  };

  const hanldeGetEditGroup = () => {
    const fix = allPlatform
      ?.filter((type) => type?.isChecked === true)
      .map((item) => item.id);
    setSelectedType((prev) => [...prev, ...fix]);
  };

  const handleAcceptStore = () => {
    setTypeAndPlatform((prev) => ({ ...prev, store: selectStore }));
  };

  const handleGetEditStore = () => {
    const fix = storeList
      ?.filter((store) => store?.isChecked === true)
      .map((item) => item.id);
    setSelectStore((prev) => [...prev, ...fix]);
  };

  const handleAcceptCustomer = () => {
    setTypeAndPlatform((prev) => ({ ...prev, customer: selectedCustomer }));
  };

  const handleGetEditCustomer = () => {
    const fix = allCustomer
      ?.filter((custom) => custom?.isChecked === true)
      .map((item) => item.id);
    setSelectedCustomer((prev) => [...prev, ...fix]);
  };

  useEffect(() => {
    handleGetslaPromotionTypeList();
    handleSlaCustomerGroupList();
    handleSlaPromotionPlatformList(detailRow?.data?.id);
    handleGroupStore();
    if (detailRow?.data?.id) {
      handleGetDataEditFields();
    }
  }, []);

  useEffect(() => {
    if (storeList.length !== 0) {
      handleGetEditCustomer();
      handleGetEditStore();
      hanldeGetEditGroup();
    }
  }, [storeList]);

  return (
    <Row className="d-flex">
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
        <TableMultiSelect2
          itemName={"platformName"}
          selected={selectedType}
          setSelected={setSelectedType}
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
        <TableMultiSelect2
          itemName={"locationName"}
          selected={selectStore}
          setSelected={setSelectStore}
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
        <TableMultiSelect2
          itemName={"customerGroupName"}
          selected={selectedCustomer}
          setSelected={setSelectedCustomer}
          submit={handleAcceptCustomer}
          allListRF={allCustomer}
          columns={storeColumns}
          className="my-3"
          xxl={12}
          xl={2}
          label="گروه مشتری"
        />
      </Col>
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
    </Row>
  );
};

export default PromotionCommonDetail;
