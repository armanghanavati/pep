import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Validation from "../../utiliy/validations";
import {
  addLocPosOrderNum,
  deleteLocationPositionSupplierOrderNumberGroup,
  insertLocationPositionOrderNumberGroup,
  updateLocationPositionOrderNumberGroup,
} from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import { useDispatch, useSelector } from "react-redux";
import StringHelpers from "../../utiliy/GlobalMethods";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";

const GroupDelete = ({
  setShowDelete,
  showDelete,
  isEditFields,
  mountLists,
}) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [locationList, setLocationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [inputFields, setInputFields] = useState({});
  const [errors, setErrors] = useState({});

  const handleValidation = (inputsName = []) => {
    const err = { ...errors };
    inputsName.map((item) => {
      if (
        inputFields[item] === undefined ||
        (inputFields[item] === null) |
          (JSON.stringify(inputFields[item])?.trim() === "")
      ) {
        err[item] = ["پرکردن این فیلد الزامی است"];
      }
    });
    setErrors(err);
    return err;
  };

  const permitForNextStep = (inputsName = []) => {
    const error = handleValidation(inputsName);
    for (var key in error) {
      if (error[key]?.length > 0) {
        if (inputsName.includes(key)) {
          return false;
        }
      }
    }
    return true;
  };

  const questionError = (e) => {
    console.log(e);
    if (permitForNextStep(["location", "position", "supplier"]) === true) {
      handleAccept();
    }
  };

  const handleChangeInputs = (
    name,
    value,
    validationNameList = undefined,
    index
  ) => {
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });
  };

  console.log(inputFields);

  const handleAccept = asyncWrapper(async () => {
    const postData = {
      locationIds: inputFields?.location?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.location, locationList)
        : inputFields?.location,
      positionIds: inputFields?.position?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.position, positionList)
        : inputFields?.position,
      supplierIds: inputFields?.supplier?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.supplier, supplierList)
        : inputFields?.supplier,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await deleteLocationPositionSupplierOrderNumberGroup(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    console.log(res);
    if (status === "Success") {
      mountLists();
      setShowDelete(false);
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

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(users?.userId);
    console.log(res);
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

  return (
    <>
      <Modal
        size="lg"
        label="حذف گروهی"
        isOpen={showDelete}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowDelete(false)}
            label="لغو"
          />,
          <Button type="success" onClick={handleAccept} label="تایید" />,
        ]}
      >
        <CommonFields
          isEditFields={isEditFields}
          errors={errors}
          inputFields={inputFields}
          handleChangeInputs={handleChangeInputs}
          locationList={locationList}
          setLocationList={setLocationList}
          supplierList={supplierList}
          setSupplierList={setSupplierList}
          positionList={positionList}
          setPositionList={setPositionList}
        />
      </Modal>
    </>
  );
};

export default GroupDelete;
