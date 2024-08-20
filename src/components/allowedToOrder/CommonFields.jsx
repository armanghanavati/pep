import React, { useEffect, useState } from "react";
import ComboBox from "../common/ComboBox";
import { useDispatch, useSelector } from "react-redux";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import { Col, Row } from "reactstrap";
import Input from "../common/Inputs/Input";
import Validation from "../../utiliy/validations";

const CommonFields = () => {
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
  };

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
    <>
      <Row>
        <ComboBox
          multi
          label="فروشگاه"
          xxl={6}
          xl={6}
          options={locationList}
          onChange={(e) => setLocation(e)}
          value={location}
        />
        <ComboBox
          multi
          xxl={6}
          xl={6}
          options={positionList}
          rtlEnabled={true}
          label="سمت"
          displayExpr="positionName"
          onChange={(e) => setPosition(e)}
          value={position}
        />
        <ComboBox
          multi
          xxl={6}
          xl={6}
          options={supplierList}
          label="تامین کننده"
          onChange={(e) => setSupplier(e)}
          value={supplier}
        />
        <Col className="my-2" xl="6" xxl="6">
          <Input
            className="fw-normal"
            type="number"
            maxLength={30}
            name="maxAllowOrderNumberSnapp"
            onChange={handleChangeInputs}
            value={inputFields?.maxAllowOrderNumberSnapp}
            label="تعداد مجاز سفارش اسنپ"
            xxl="12"
            xl="12"
          />
        </Col>
        تعداد مجاز ویرایش (کم کردن) سفارش انباری
      </Row>
    </>
  );
};

export default CommonFields;
