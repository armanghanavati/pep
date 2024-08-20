import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import { Col, Row } from "reactstrap";
import TableMultiSelect2 from "../common/Tables/TableMultiSelect2";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { useDispatch, useSelector } from "react-redux";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../redux/reducers/main/main-slice";
import ComboBox from "../common/ComboBox";
import Validation from "../../utiliy/validations";
import {
  copySupplierLocationSupplierLimitList,
  supplierLocationSupplierLimitListByLocationId,
} from "../../redux/reducers/supplier/supplier-action";
import RangeSlider from "../common/RangeSlider";

const Coppy = ({
  storeList,
  showCoppy,
  setShowCoppy,
  handleAllLocationSupplierLimitList,
}) => {
  const dispatch = useDispatch();
  const [selectedLocationDestintion, setSelectedLocationDestintion] = useState(
    []
  );
  const [inputFields, setInputFields] = useState({});
  const [getStartedSupplier, setGetStartedSupplier] = useState([]);
  const [selectedStartedSupplier, setSelectedStartedSupplier] = useState([]);
  const [allStartedSupplier, setAllStartedSupplier] = useState([]);
  const [getLocationDestintion, setGetLocationDestintion] = useState([]);

  const handleChangeInputs = (name, value) => {
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });
    console.log(name, value);
    if (name === "startLocation") {
      handleSubmitLocation(value);
    }
  };

  const handleSubmitLocation = asyncWrapper(async (value) => {
    dispatch(RsetIsLoading({ stateWait: true }));
    console.log(inputFields);
    const res = await supplierLocationSupplierLimitListByLocationId(value);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { status, data, message } = res;
    if (status == "Success") {
      setAllStartedSupplier(data);
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

  const handleCopy = asyncWrapper(async () => {
    const postData = {
      locationSourceId: inputFields?.startLocation,
      supplierSourceIds: selectedStartedSupplier,
      locationDestinationIds: selectedLocationDestintion,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await copySupplierLocationSupplierLimitList(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    console.log(res);

    const { data, status, message } = res;
    if (status == "Success") {
      setShowCoppy(false);
      handleAllLocationSupplierLimitList();
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message,
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
    <Modal
      size="xl"
      onClose={() => setShowCoppy(false)}
      label="کپی تنظیمات"
      isOpen={showCoppy}
      footerButtons={[
        <>
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowCoppy(false)}
            label="لغو"
          />
          <Button type="success" onClick={handleCopy} label="کپی" />
        </>,
      ]}
    >
      <Row className="">
        <ComboBox
          className="mt-0"
          name="startLocation"
          value={inputFields?.startLocation}
          onChange={handleChangeInputs}
          options={storeList}
          xxl={6}
          xl={6}
          label="فروشگاه مبداء"
        />
        <TableMultiSelect2
          itemName={"label"}
          selected={selectedStartedSupplier}
          setSelected={setSelectedStartedSupplier}
          submit={() => setGetStartedSupplier(selectedStartedSupplier)}
          allListRF={allStartedSupplier}
          xxl={6}
          xl={6}
          label="تامین کننده مبداء"
        />
        <TableMultiSelect2
          itemName={"label"}
          className="mt-4"
          selected={selectedLocationDestintion}
          setSelected={setSelectedLocationDestintion}
          submit={() => setGetLocationDestintion(selectedLocationDestintion)}
          allListRF={storeList}
          xxl={6}
          xl={6}
          label="فروشگاه مقصد"
        />
      </Row>
    </Modal>
  );
};

export default Coppy;
