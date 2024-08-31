import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Validation from "../../utiliy/validations";
import {
  addLocPosOrderNum,
  insertLocationPositionOrderNumberGroup,
  updateLocationPositionOrderNumberGroup,
} from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import { useDispatch, useSelector } from "react-redux";
import StringHelpers from "../../utiliy/GlobalMethods";
import {
  userLocationListComboByUserId,
  userLocationListUserId,
} from "../../redux/reducers/user/user-actions";
import {
  positionListByCompanyId,
  positionListWithCompanyId,
} from "../../redux/reducers/position/position-actions";
import {
  insertSupplierListByCompany,
  supplierByCompanyId,
  supplierListByCompany,
} from "../../redux/reducers/supplier/supplier-action";

const GroupAdd = ({ showAdd, setShowAdd, isEditFields, mountLists }) => {
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
        inputFields[item] === null ||
        JSON.stringify(inputFields[item])?.trim() === ""
      ) {
        console.log(inputFields[item]);
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

  const questionAcceptError = (e) => {
    if (
      permitForNextStep([
        "maxOrderNumber",
        "maxOrderNumber",
        "maxIncEditOrderNumber",
        "maxNewInventoryOrderNumber",
        "maxZeroInventoryOrderNumber",
        "maxOutRouteNumber",
        "maxDecEditSupplierOrderNumber",
        "maxIncEditSupplierOrderNumber",
        "maxNewSupplierOrderNumber",
        "maxZeroSupplierOrderNumber",
        "maxOutRouteSupplierOrderNumber",
        "location",
        "position",
        "supplier",
      ]) === true
    ) {
      handleAccept();
    }
  };

  const questionEditError = (e) => {
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
    const temp = [];
    validationNameList &&
      validationNameList.map((item) => {
        if (Validation[item[0]](value, item[1]) === true) {
          return null;
        } else {
          temp.push(Validation[item[0]](value, item[1]));
        }
      });
    console.log(validationNameList, Validation);
    setErrors((prevstate) => {
      return { ...prevstate, [name]: [...temp] };
    });
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });
  };

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
      maxIncEditOrderNumber: inputFields?.maxIncEditOrderNumber || null,
      maxOrderNumber: inputFields?.maxOrderNumber || null,
      maxNewInventoryOrderNumber:
        inputFields?.maxNewInventoryOrderNumber || null,
      maxZeroInventoryOrderNumber:
        inputFields?.maxZeroInventoryOrderNumber || null,
      maxOutRouteNumber: inputFields?.maxOutRouteNumber || null,
      maxDecEditSupplierOrderNumber:
        inputFields?.maxDecEditSupplierOrderNumber || null,
      maxIncEditSupplierOrderNumber:
        inputFields?.maxIncEditSupplierOrderNumber || null,
      maxNewSupplierOrderNumber: inputFields?.maxNewSupplierOrderNumber || null,
      maxZeroSupplierOrderNumber:
        inputFields?.maxZeroSupplierOrderNumber || null,
      maxOutRouteSupplierOrderNumber:
        inputFields?.maxOutRouteSupplierOrderNumber || null,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    if (isEditFields) {
      const res = await updateLocationPositionOrderNumberGroup(postData);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      console.log(res);
      if (status === "Success") {
        setShowAdd(false);
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
    } else {
      const res = await insertLocationPositionOrderNumberGroup(postData);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status === "Success") {
        setShowAdd(false);
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
    }
  });

  const handleEditLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(users?.userId);
    console.log(res);
    setLocationList(res?.data);
  });

  const handleAddPositionList = asyncWrapper(async () => {
    const res = await positionListByCompanyId(companies?.currentCompanyId);
    const { data, status, message } = res;
    console.log(data);
    if (status == "Success") {
      let temp = [];
      const fixData = data?.map((item) => ({
        id: item?.id,
        label: item?.positionName,
      }));
      temp.push({ id: 0, label: "همه" }, ...fixData);
      setPositionList(temp);
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
    if (!isEditFields) {
      // افزودن
      handleAddLocationList();
      handleAddSupplierList();
      handleAddPositionList();
    } else {
      // ویرایش
      handleEditLocationList();
      handleEditSupplierList();
      handleEditPositionList();
    }
  }, []);

  const handleAddSupplierList = asyncWrapper(async () => {
    const res = await insertSupplierListByCompany(companies?.currentCompanyId);
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

  // سرویس فروشگاه برای افزودن
  const handleAddLocationList = asyncWrapper(async () => {
    const res = await userLocationListComboByUserId(
      users?.userId,
      companies?.currentCompanyId
    );
    const { data, status, message } = res;
    if (status == "Success") {
      console.log(data);
      setLocationList(data);
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

  const handleEditPositionList = asyncWrapper(async () => {
    const res = await positionListWithCompanyId(companies?.currentCompanyId);
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

  const handleEditSupplierList = asyncWrapper(async () => {
    const res = await supplierByCompanyId(companies?.currentCompanyId);
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
        label={!isEditFields ? "افزودن گروهی" : "ویرایش گروهی"}
        isOpen={showAdd}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowAdd(false)}
            label="لغو"
          />,
          <Button
            type="success"
            onClick={!isEditFields ? questionAcceptError : questionEditError}
            label="تایید"
          />,
        ]}
      >
        <CommonFields
          locationList={locationList}
          setLocationList={setLocationList}
          supplierList={supplierList}
          setSupplierList={setSupplierList}
          positionList={positionList}
          setPositionList={setPositionList}
          errors={errors}
          inputFields={inputFields}
          handleChangeInputs={handleChangeInputs}
          locPosSupp={true}
          isEditFields={isEditFields}
        />
      </Modal>
    </>
  );
};

export default GroupAdd;
