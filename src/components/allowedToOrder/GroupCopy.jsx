import React, { useEffect, useState } from "react";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import CommonFields from "./CommonFields";
import ComboBox from "../common/ComboBox";
import { useDispatch, useSelector } from "react-redux";
import Validation from "../../utiliy/validations";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { Row } from "reactstrap";

const GroupCopy = ({ setShowCopy, showCopy }) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [locationList, setLocationList] = useState([]);
  const [location, setLocation] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [position, setPosition] = useState([]);
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

  console.log(inputFields);

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(
      users?.userId,
      companies?.currentCompanyId
    );
    setLocationList(res?.data?.data);
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
          <Button type="success" onClick={() => {}} label="تایید" />,
        ]}
      >
        <Row>
          <ComboBox
            multi
            name="startLocation"
            label="فروشگاه مبداء"
            xxl={6}
            xl={6}
            options={locationList}
            onChange={handleChangeInputs}
            value={inputFields?.startLocation}
          />
          <ComboBox
            name="startPosition"
            multi
            xxl={6}
            xl={6}
            options={positionList}
            rtlEnabled={true}
            label="سمت  مبداء"
            displayExpr="positionName"
            onChange={handleChangeInputs}
            value={inputFields?.startPosition}
          />
          <ComboBox
            name="startSupplier"
            multi
            xxl={6}
            xl={6}
            options={supplierList}
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
            displayExpr="positionName"
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
