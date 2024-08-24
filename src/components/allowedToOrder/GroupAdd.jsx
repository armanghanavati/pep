import React, { useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Validation from "../../utiliy/validations";
import { addLocPosOrderNum } from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import { useDispatch } from "react-redux";

const GroupAdd = ({ showAdd, setShowAdd, isEditFields }) => {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
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
  };

  const handleAccept = asyncWrapper(async () => {
    const postData = {
      locationIds: inputFields?.location,
      positionIds: inputFields?.position,
      supplierIds: inputFields?.supplier,
      maxOrderNumber: inputFields?.maxOrderNumber,
      maxIncEditOrderNumber: inputFields?.maxIncEditOrderNumber,
      maxNewInventoryOrderNumber: inputFields?.maxNewInventoryOrderNumber,
      maxZeroInventoryOrderNumber: inputFields?.maxZeroInventoryOrderNumber,
      maxOutRouteNumber: inputFields?.maxOutRouteNumber,
      maxDecEditSupplierOrderNumber: inputFields?.maxDecEditSupplierOrderNumber,
      maxIncEditSupplierOrderNumber: inputFields?.maxIncEditSupplierOrderNumber,
      maxNewSupplierOrderNumber: inputFields?.maxNewSupplierOrderNumber,
      maxZeroSupplierOrderNumber: inputFields?.maxZeroSupplierOrderNumber,
      maxOutRouteSupplierOrderNumber:
        inputFields?.maxOutRouteSupplierOrderNumber,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await addLocPosOrderNum(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    console.log(res);
    if (status === "Success") {
      setShowAdd(false);
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
          <Button type="success" onClick={handleAccept} label="تایید" />,
        ]}
      >
        <CommonFields
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
