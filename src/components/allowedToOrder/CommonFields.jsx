import React, { useEffect, useState } from "react";
import ComboBox from "../common/ComboBox";
import { useDispatch, useSelector } from "react-redux";
import asyncWrapper from "../../utiliy/asyncWrapper";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
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
  locationList,
  supplierList,
  positionList,
  editLcationList,
  editSupplierList,
  editPositionList,
}) => {
  return (
    <>
      <Row>
        <ComboBox
          error={errors?.location}
          validations={[["required"]]}
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
          error={errors?.position}
          validations={[["required"]]}
          name="position"
          multi
          xxl={6}
          xl={6}
          options={positionList}
          label="سمت"
          onChange={handleChangeInputs}
          value={inputFields?.position}
        />
        <ComboBox
          error={errors?.supplier}
          validations={[["required"]]}
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
              error={errors?.maxIncEditOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxNewInventoryOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxZeroInventoryOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxOutRouteNumber}
              validations={[["required"]]}
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
              error={errors?.maxDecEditSupplierOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxIncEditSupplierOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxNewSupplierOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxZeroSupplierOrderNumber}
              validations={[["required"]]}
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
              error={errors?.maxOutRouteSupplierOrderNumber}
              validations={[["required"]]}
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
