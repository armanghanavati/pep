import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";
import ComboBox from "../common/ComboBox";
import { useDispatch, useSelector } from "react-redux";
import Validation from "../../utiliy/validations";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { Row } from "reactstrap";
import { copyLocationPositionOrderNumberGroup } from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import StringHelpers from "../../utiliy/GlobalMethods";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";

const GroupCopy = ({ setShowCopy, showCopy, mountLists }) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [locationList, setLocationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [errors, setErrors] = useState({});
  const [inputFields, setInputFields] = useState({});

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
    console.log(value, name);
  };

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(users?.userId);
    setLocationList(res?.data);
  });

  useEffect(() => {
    handleLocationList();
    handleSupplierList();
    handlePositionList();
  }, []);

  const handlePositionList = asyncWrapper(async () => {
    const res = await positionListWithCompanyId(companies.currentCompanyId);
    const { data, status, message } = res;
    if (status == "Success") {
      setPositionList(data);
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

  const handleSupplierList = asyncWrapper(async () => {
    const res = await supplierByCompanyId(companies.currentCompanyId);
    const { data, status, message } = res;
    if (status == "Success") {
      setSupplierList(data);
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

  const handleAccept = asyncWrapper(async () => {
    const postData = {
      locationSourceId:
        inputFields?.startLocation === 0
          ? StringHelpers.fixComboId(inputFields?.startLocation, locationList)
          : inputFields?.startLocation,
      positionSourceId:
        inputFields?.startPosition === 0
          ? StringHelpers.fixComboId(inputFields?.startPosition, positionList)
          : inputFields?.startPosition,
      supplierSourceId:
        inputFields?.startSupplier === 0
          ? StringHelpers.fixComboId(inputFields?.startSupplier, supplierList)
          : inputFields?.startSupplier,
      locationDestinationIds: inputFields?.endLocation?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.endLocation, locationList)
        : inputFields?.endLocation,
      positioDestinationIds: inputFields?.endPosition?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.endPosition, positionList)
        : inputFields?.endPosition,
      supplierDestinationIds: inputFields?.endSupplier?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.endSupplier, supplierList)
        : inputFields?.endSupplier,
    };
    const res = await copyLocationPositionOrderNumberGroup(postData);
    const { data, status, message } = res;
    if (status === "Success") {
      setShowCopy(false);
      mountLists();
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
  });

  const fixLocationRemoveZeroId = locationList?.filter((item) => item?.id > 0);
  const fixPositionListRemoveZeroId = positionList?.filter(
    (item) => item?.id > 0
  );
  const fixSupplierListRemoveZeroId = supplierList?.filter(
    (item) => item?.id > 0
  );

  return (
    <span>
      <Modal
        size="lg"
        label={"کپی تنظیمات"}
        isOpen={showCopy}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowCopy(false)}
            label="لغو"
          />,
          <Button type="success" onClick={handleAccept} label="تایید" />,
        ]}
      >
        <Row>
          <ComboBox
            name="startLocation"
            label="فروشگاه مبداء"
            xxl={6}
            xl={6}
            options={fixLocationRemoveZeroId}
            onChange={handleChangeInputs}
            value={inputFields?.startLocation}
          />
          <ComboBox
            name="startPosition"
            xxl={6}
            xl={6}
            options={fixPositionListRemoveZeroId}
            rtlEnabled={true}
            label="سمت  مبداء"
            onChange={handleChangeInputs}
            value={inputFields?.startPosition}
          />
          <ComboBox
            name="startSupplier"
            xxl={6}
            xl={6}
            options={fixSupplierListRemoveZeroId}
            label="تامین  کننده مبداء"
            onChange={handleChangeInputs}
            value={inputFields?.startSupplier}
          />
          <ComboBox
            name="endLocation"
            multi
            label="فروشگاه مقصد"
            xxl={6}
            xl={6}
            options={locationList}
            onChange={handleChangeInputs}
            value={inputFields?.endLocation}
          />
          <ComboBox
            multi
            name="endPosition"
            xxl={6}
            xl={6}
            options={positionList}
            rtlEnabled={true}
            label="سمت مقصد"
            onChange={handleChangeInputs}
            value={inputFields?.endPosition}
          />
          <ComboBox
            name="endSupplier"
            multi
            xxl={6}
            xl={6}
            options={supplierList}
            label="تامین کننده مقصد"
            onChange={handleChangeInputs}
            value={inputFields?.endSupplier}
          />
        </Row>
      </Modal>
    </span>
  );
};

export default GroupCopy;
