import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import { Col } from "reactstrap";
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
  addLocationSupplierLimitList,
  deleteLocationSupplierLimitList,
  supplierLocationSupplierLimitListByLocationIds,
  updateLocationSupplierLimitList,
} from "../../redux/reducers/supplier/supplier-action";
import RangeSlider from "../common/RangeSlider";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";

const AddSupplierLocation = ({
  handleAllLocationSupplierLimitList,
  setShowSupplier,
  showSupplier,
  storeList,
  setStoreList,
  inputFields,
  setInputFields,
  getLocation,
  setGetLocation,
  allSupplier,
  setAllSupplier,
  editSupplierRowData,
  handleSupplierLocationSupplierLimitListByLocationIds,
  itsEdit,
}) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state);
  const [selectedSupplier, setSelectedSupplier] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState([]);
  const [getSupplier, setGetSupplier] = useState({});

  const fixStoreList = storeList?.map((store) => ({
    id: store?.id,
    label: store?.locationName,
  }));

  const handleChangeInputs = (
    name,
    value,
    validationNameList = undefined,
    index
  ) => {
    setInputFields((prevstate) => {
      return { ...prevstate, [name]: value };
    });

    if (name === "loaction") {
      const fixValue = [value];
      handleSupplierLocationSupplierLimitListByLocationIds(fixValue);
    }
  };

  const handleDeleted = asyncWrapper(async () => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await deleteLocationSupplierLimitList(
      editSupplierRowData?.data?.locationId,
      editSupplierRowData?.data?.supplierId
    );
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      setShowSupplier(false);
      handleAllLocationSupplierLimitList();
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

  console.log(inputFields);

  const handleAccept = asyncWrapper(async () => {
    const postData = {
      loctionIds: selectedLocation,
      supplierIds: selectedSupplier,
      minOrderWeight: inputFields?.weight?.[0],
      maxOrderWeight: inputFields?.weight?.[1],
      minOrderRiali: inputFields?.rial?.[0],
      maxOrderRiali: inputFields?.rial?.[1],
      minOrderNumber: inputFields?.number?.[0],
      maxOrderNumber: inputFields?.number?.[1],
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await addLocationSupplierLimitList(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status === "Success") {
      setShowSupplier(false);
      handleAllLocationSupplierLimitList();
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

  console.log(editSupplierRowData);

  const handleEdit = asyncWrapper(async () => {
    const dataPost = {
      locationId: editSupplierRowData?.data?.locationId,
      supplierId: editSupplierRowData?.data?.supplierId,
      minOrderWeight: inputFields?.weight?.[0],
      maxOrderWeight: inputFields?.weight?.[1],
      minOrderRiali: inputFields?.rial?.[0],
      maxOrderRiali: inputFields?.rial?.[1],
      minOrderNumber: inputFields?.number?.[0],
      maxOrderNumber: inputFields?.number?.[1],
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await updateLocationSupplierLimitList(dataPost);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status === "Success") {
      setShowSupplier(false);
      handleAllLocationSupplierLimitList();
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
      onClose={() => setShowSupplier(false)}
      label="ایجاد"
      isOpen={showSupplier}
      footerButtons={[
        itsEdit && (
          <Button
            icon={<DeleteIcon className="font18 fw-bold ms-1 cursorPointer" />}
            type="danger"
            onClick={handleDeleted}
            label="حذف"
          />
        ),
        <Button
          text="Outlined"
          stylingMode="outlined"
          type="danger"
          onClick={() => setShowSupplier(false)}
          label="لغو"
        />,
        <Button
          onClick={itsEdit ? handleEdit : handleAccept}
          icon={<CheckIcon className="ms-1 font18 fw-bold" />}
          text="success"
          stylingMode="success"
          type="success"
          label="تایید"
        />,
      ]}
    >
      <Col className="d-flex justify-content-around" xxl={12} xl={12}>
        {!itsEdit ? (
          <TableMultiSelect2
            itemName={"label"}
            selected={selectedLocation}
            setSelected={setSelectedLocation}
            submit={() => setGetLocation(selectedLocation)}
            allListRF={fixStoreList}
            xxl={5}
            xl={5}
            label="فروشگاه"
          />
        ) : (
          <>
            <label> فروشگاه: </label>
            <span>{editSupplierRowData?.data?.locationName}</span>
          </>
        )}
        {!itsEdit ? (
          <TableMultiSelect2
            itemName={"label"}
            selected={selectedSupplier}
            setSelected={setSelectedSupplier}
            submit={() => setGetSupplier(selectedSupplier)}
            allListRF={allSupplier}
            xxl={5}
            xl={5}
            label="تامین کننده"
          />
        ) : (
          <>
            <label> تامین کننده: </label>
            <span>{editSupplierRowData?.data?.supplierName}</span>
          </>
        )}
      </Col>
      <RangeSlider
        name="weight"
        isWeight
        label="وزن"
        onChange={(e) => handleChangeInputs("weight", e.target.value)}
        value={inputFields.weight || [0, 10000]}
        min={0}
        max={10000}
      />
      <RangeSlider
        name="number"
        label="تعداد"
        onChange={(e) => handleChangeInputs("number", e.target.value)}
        value={inputFields.number || [0, 1000000]}
        min={0}
        max={1000000}
      />
      <RangeSlider
        isCurrency
        labelType=""
        name="rial"
        label="ریال"
        valueLabelDisplay="auto"
        onChange={(e) => handleChangeInputs("rial", e.target.value)}
        value={inputFields?.rial || [0, 10000000000]}
        min={0}
        max={10000000000}
      />
    </Modal>
  );
};

export default AddSupplierLocation;
