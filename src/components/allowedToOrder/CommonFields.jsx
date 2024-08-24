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

const CommonFields = ({
  locPosSupp = false,
  isEditFields,
  errors,
  inputFields,
  handleChangeInputs,
}) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [locationList, setLocationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);

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
          name="location"
          multi
          label="فروشگاه"
          xxl={6}
          xl={6}
          options={locationList}
          onChange={handleChangeInputs}
          value={inputFields?.location}
        />
        <ComboBox
          name="position"
          multi
          xxl={6}
          xl={6}
          options={positionList}
          label="سمت"
          displayExpr="positionName"
          onChange={handleChangeInputs}
          value={inputFields?.position}
        />
        <ComboBox
          name="supplier"
          multi
          xxl={6}
          xl={6}
          options={supplierList}
          label="تامین کننده"
          onChange={handleChangeInputs}
          value={inputFields?.supplier}
        />
        {locPosSupp && (
          <Row>
            <Input
              error={errors?.maxOrderNumber}
              validations={[["required"]]}
              className="my-2"
              type="number"
              maxLength={30}
              name="maxOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxOrderNumber}
              label="تعداد مجاز ویرایش (کم کردن) سفارش انباری"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxIncEditOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxIncEditOrderNumber}
              label="تعداد مجاز ویرایش (افزایش دادن) سفارش انباری"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxNewInventoryOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxNewInventoryOrderNumber}
              label="تعداد مجاز سفارش جدید انباری"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxZeroInventoryOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxZeroInventoryOrderNumber}
              label="تعداد مجاز صفر کردن سفارش انباری"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxOutRouteNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxOutRouteNumber}
              label="تعداد ویرایش سفارش بدون برنامه ریزی انباری"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxDecEditSupplierOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxDecEditSupplierOrderNumber}
              label="تعداد مجاز ویرایش (کم کردن) سفارش دایرکتی"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxIncEditSupplierOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxIncEditSupplierOrderNumber}
              label="تعداد مجاز ویرایش (افزایش دادن) سفارش دایرکتی"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxNewSupplierOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxNewSupplierOrderNumber}
              label="تعداد مجاز سفارش جدید دایرکتی"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxZeroSupplierOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxZeroSupplierOrderNumber}
              label="تعداد مجاز صفر کردن سفارش دایرکتی"
              xxl="6"
              xl="6"
            />
            <Input
              className="my-2"
              type="number"
              maxLength={30}
              name="maxOutRouteSupplierOrderNumber"
              onChange={handleChangeInputs}
              value={inputFields?.maxOutRouteSupplierOrderNumber}
              label="تعداد مجاز جدید سفارش دایرکتی بدون برنامه ریزی"
              xxl="6"
              xl="6"
            />
          </Row>
        )}
      </Row>
    </>
  );
};

export default CommonFields;
