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
import { supplierLocationSupplierLimitListByLocationIds } from "../../redux/reducers/supplier/supplier-action";
import RangeSlider from "../common/RangeSlider";

const AddSupplierLocation = ({
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
  handleSupplierLocationSupplierLimitListByLocationIds,
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
    console.log(name, value);
    if (name === "loaction") {
      const fixValue = [value];
      handleSupplierLocationSupplierLimitListByLocationIds(fixValue);
    }
  };

  return (
    <Modal
      size="xl"
      onClose={() => setShowSupplier(false)}
      label="ایجاد"
      isOpen={showSupplier}
      footerButtons={[
        <>
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            // onClick={() => setShowDetail(false)}
            label="لغو"
          />
          <Button
            // onClick={handleQuestionToAcceptEdit}
            text="success"
            stylingMode="success"
            type="success"
            label="تایید"
          />
        </>,
      ]}
    >
      <Col className="d-flex justify-content-around" xxl={12} xl={12}>
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
        value={
          inputFields?.rial || [inputFields?.rial?.[0], inputFields?.rial?.[1]]
        }
        min={0}
        max={10000000000}
      />
    </Modal>
  );
};

export default AddSupplierLocation;
