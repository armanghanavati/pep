import React, { useEffect, useState } from "react";
import Modal from "../Modals/Modal";
import Button from "../Buttons/Button";
import { Col, Container, Label, Row } from "reactstrap";
import ComboBox from "../ComboBox";
import CheckBox from "../SwitchCases/SwitchCase";
import Input from "../Inputs/Input";
import SwitchCase from "../SwitchCases/SwitchCase";
import RangeSlider from "../RangeSlider";
import Validation from "../../../utiliy/validations";
import TableMultiSelect2 from "../Tables/TableMultiSelect2";
import { getTableFields } from "../../../redux/reducers/main/main-action";
import { useLocation } from "react-router";
import asyncWrapper from "../../../utiliy/asyncWrapper";
import {
  RsetIsLoading,
  RsetShowToast,
} from "../../../redux/reducers/main/main-slice";
import { useDispatch, useSelector } from "react-redux";
import { updateItemLocationGroup } from "../../../redux/reducers/location/location-actions";
import StringHelpers from "../../../utiliy/GlobalMethods";
import Toastify from "../Toasts/Toastify";
import EditIcon from "@mui/icons-material/Edit";
import { Slider } from "@mui/material";
import { userLocationListUserId } from "../../../redux/reducers/user/user-actions";
import { copyItemLocationGroup } from "../../../redux/reducers/itemLocation/itemLocation-actions";
import { TagBox } from "devextreme-react";
import DataSource from "devextreme/data/data_source";
import {
  groupBySupplierId,
  itemComboByItemGroupAndSupplierList,
} from "../../../redux/reducers/itemGroup/itemGroup-actions";

const EditTables = ({
  mulltiComponents,
  fn_CheckValidation,
  supplierList,
  inventoryList,
  filedFineds,
  allState,
  optionFieldFind,
  valueFieldFind,
}) => {
  const dispatch = useDispatch();
  const { companies, users } = useSelector((state) => state);
  const [inputFields, setInputFields] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [locationList, setLocationList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [groupList, setGroupList] = useState([]);

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(
      users?.userId,
      companies?.currentCompanyId
    );
    setLocationList(res?.data?.data);
  });

  const handleGroupListBySupplier = asyncWrapper(async (e) => {
    dispatch(RsetIsLoading({ stateWait: true }));
    if (e.includes(0)) {
      const fixLoop = StringHelpers.fixComboListId(e, supplierList);
      console.log(fixLoop);
      const res = await groupBySupplierId(fixLoop);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status == "Success") {
        setGroupList(data);
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
      const res = await groupBySupplierId(e);
      dispatch(RsetIsLoading({ stateWait: false }));
      const { data, status, message } = res;
      if (status == "Success") {
        setGroupList(data);
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

  const handleListByGroupIds = asyncWrapper(async (e) => {
    dispatch(RsetIsLoading({ stateWait: true }));
    const postData = {
      itemGroupIds: e?.includes(0)
        ? StringHelpers.fixComboListId(e, groupList)
        : e,
      supplierIds: inputFields?.supplier.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.supplier, supplierList)
        : inputFields?.supplier,
    };
    const res = await itemComboByItemGroupAndSupplierList(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      const LAZY = new DataSource({
        store: data,
        paginate: true,
        pageSize: 10,
      });
      setItemList(LAZY);
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
  const fixListForId = itemList._store?._array?.map((item) => item?.id);

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
    if (name === "supplier") {
      handleGroupListBySupplier(value);
    }
    if (name === "group") {
      handleListByGroupIds(value);
    }
  };

  useEffect(() => {
    setInputFields({});
    handleLocationList();
  }, []);

  const handleAcceptEditTable = asyncWrapper(async () => {
    const postData = {
      itemIds: inputFields?.item?.includes(0)
        ? fixListForId
        : inputFields?.item,
      locationIds: inputFields?.location?.includes(0)
        ? StringHelpers?.fixComboListId(inputFields?.location, locationList)
        : inputFields?.location,
      inventoryIds: inputFields?.inventory || null,
      isActive: StringHelpers?.sliderThree(inputFields?.isActive) ?? null,
      maxPercentChange: inputFields?.maxPercentChange || null,
      minPercentChange: inputFields?.minPercentChange || null,
      isCreateOrderInventory:
        StringHelpers?.sliderThree(inputFields?.isCreateOrderInventory) ?? null,
      isCreateOrderSupplier:
        StringHelpers?.sliderThree(inputFields?.isCreateOrderSupplier) ?? null,
      orderNumber: inputFields?.orderNumber || null,
      isActiveSnapp:
        StringHelpers?.sliderThree(inputFields?.isActiveSnapp) ?? null,
      isSentToSnapp:
        StringHelpers?.sliderThree(inputFields?.isSentToSnapp) ?? null,
      maxAllowOrderNumberSnapp: inputFields?.maxAllowOrderNumberSnapp || null,
      allowNewOrderInventory:
        StringHelpers?.sliderThree(inputFields?.allowNewOrderInventory) ?? null,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await updateItemLocationGroup(postData);
    dispatch(RsetIsLoading({ stateWait: false }));
    const { data, status, message } = res;
    if (status == "Success") {
      setShowEditModal(false);
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
    // }
  });

  const isActiveMarks = [
    {
      value: 0,

      label: "فعال",
    },
    {
      value: 50,
      label: "عادی",
    },
    {
      value: 100,
      label: "غیرفعال",
    },
  ];

  console.log(inputFields);

  return (
    <span className="">
      <Button
        type="success"
        icon={<EditIcon className="ms-1 font18 fw-bold" />}
        onClick={() => setShowEditModal(true)}
        label="ویرایش جدول"
      />
      <Modal
        size="xl"
        label={"ویرایش"}
        isOpen={showEditModal}
        footerButtons={[
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowEditModal(false)}
            label="لغو"
          />,
          <Button
            type="success"
            onClick={handleAcceptEditTable}
            label="تایید"
          />,
        ]}
      >
        <Container className="">
          {mulltiComponents?.map((item) => (
            <Col xl="12" xxl="12" className=" d-flex pb-2">
              {item}
            </Col>
          ))}
          {/* ------------------------------------------------------------------------- */}
          <Row>
            <ComboBox
              multi
              label="فروشگاه"
              xxl={6}
              xl={6}
              name="location"
              options={locationList}
              onChange={handleChangeInputs}
              value={inputFields?.location}
            />
            <ComboBox
              multi
              xxl={6}
              xl={6}
              options={inventoryList}
              name="inventory"
              label="انبار"
              onChange={handleChangeInputs}
              value={inputFields?.inventory}
            />
            <ComboBox
              xxl={6}
              xl={6}
              label="تامین کننده"
              multi
              options={supplierList}
              name="supplier"
              onChange={handleChangeInputs}
              value={inputFields?.supplier}
            />
            <ComboBox
              xxl={6}
              xl={6}
              label="گروه کالا"
              multi
              name="group"
              options={groupList}
              onChange={handleChangeInputs}
              value={inputFields?.group}
            />
            <ComboBox
              xxl={12}
              xl={12}
              multi
              options={itemList}
              label="کالا"
              name="item"
              onChange={handleChangeInputs}
              value={inputFields?.item}
            />
          </Row>
          <Row className=" d-flex align-items-center justify-content-center">
            <Col className="my-2" xl="6" xxl="6">
              <Input
                className="fw-normal"
                type="number"
                maxLength={30}
                name="maxPercentChange"
                onChange={handleChangeInputs}
                value={inputFields?.maxPercentChange}
                label="حداکثر درصد افزایش"
                xxl="12"
                xl="12"
              />
            </Col>
            <Col className="my-2" xl="6" xxl="6">
              <Input
                className="fw-normal"
                type="number"
                maxLength={30}
                name="minPercentChange"
                onChange={handleChangeInputs}
                value={inputFields?.minPercentChange}
                label="حداکثر درصد کاهش"
                xxl="12"
                xl="12"
              />
            </Col>
            <Col className="my-2" xl="6" xxl="6">
              <Input
                className="fw-normal"
                type="number"
                maxLength={30}
                name="orderNumber"
                onChange={handleChangeInputs}
                value={inputFields?.orderNumber}
                label="تعداد سفارش"
                xxl="12"
                xl="12"
              />
            </Col>{" "}
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
          </Row>
          <Row className="gap-4 justify-content-center">
            <Col className="my-3" xxl="5">
              <Label> فعال </Label>
              <Col
                className="d-flex rounded-3 border justify-content-center align-items-center"
                xxl="12"
              >
                <Col className="d-flex justify-content-center px-5 " xxl="10">
                  <Slider
                    track={false}
                    name="isActive"
                    value={inputFields?.isActive}
                    onChange={(e) =>
                      handleChangeInputs("isActive", e.target.value)
                    }
                    defaultValue={50}
                    // getAriaValueText={`${10}°C`}
                    step={null}
                    marks={isActiveMarks}
                  />
                </Col>
              </Col>
            </Col>
            <Col className=" my-3" xxl="5">
              <Label> ایجاد سفارش انبار </Label>
              <Col
                className="d-flex border rounded-3 justify-content-center align-items-center"
                xxl="12"
              >
                <Col className="d-flex justify-content-center px-5 " xxl="10">
                  <Slider
                    track={false}
                    name="isCreateOrderInventory"
                    value={inputFields?.isCreateOrderInventory}
                    onChange={(e) =>
                      handleChangeInputs(
                        "isCreateOrderInventory",
                        e.target.value
                      )
                    }
                    defaultValue={50}
                    // getAriaValueText={`${10}°C`}
                    step={null}
                    marks={isActiveMarks}
                  />
                </Col>
              </Col>
            </Col>
            <Col className=" my-3" xxl="5">
              <Label> ارسال شده برای اسنپ </Label>
              <Col
                className="d-flex border rounded-3 justify-content-center align-items-center"
                xxl="12"
              >
                <Col className="d-flex justify-content-center px-5 " xxl="10">
                  <Slider
                    track={false}
                    name="isSentToSnapp"
                    value={inputFields?.isSentToSnapp}
                    onChange={(e) =>
                      handleChangeInputs("isSentToSnapp", e.target.value)
                    }
                    defaultValue={50}
                    // getAriaValueText={`${10}°C`}
                    step={null}
                    marks={isActiveMarks}
                  />
                </Col>
              </Col>
            </Col>
            <Col className=" my-3" xxl="5">
              <Label> ایجاد سفارش تامین کننده </Label>
              <Col
                className="d-flex border rounded-3 justify-content-center align-items-center"
                xxl="12"
              >
                <Col className="d-flex justify-content-center px-5 " xxl="10">
                  <Slider
                    track={false}
                    name="isCreateOrderSupplier"
                    value={inputFields?.isCreateOrderSupplier}
                    onChange={(e) =>
                      handleChangeInputs(
                        "isCreateOrderSupplier",
                        e.target.value
                      )
                    }
                    defaultValue={50}
                    // getAriaValueText={`${10}°C`}
                    step={null}
                    marks={isActiveMarks}
                  />
                </Col>
              </Col>
            </Col>
            <Col className=" my-3" xxl="5">
              <Label> تعداد مجاز ویرایش </Label>
              <Col
                className="d-flex border rounded-3 justify-content-center align-items-center"
                xxl="12"
              >
                <Col className="d-flex justify-content-center px-5 " xxl="10">
                  <Slider
                    track={false}
                    name="allowNewOrderInventory"
                    value={inputFields?.allowNewOrderInventory}
                    onChange={(e) =>
                      handleChangeInputs(
                        "allowNewOrderInventory",
                        e.target.value
                      )
                    }
                    defaultValue={50}
                    // getAriaValueText={`${10}°C`}
                    step={null}
                    marks={isActiveMarks}
                  />
                </Col>
              </Col>
            </Col>
            <Col className=" my-3" xxl="5">
              <Label> فعال برای اسنپ </Label>
              <Col
                className="d-flex border rounded-3 justify-content-center align-items-center"
                xxl="12"
              >
                <Col className="d-flex justify-content-center px-5 " xxl="10">
                  <Slider
                    track={false}
                    name="isActiveSnapp"
                    value={inputFields?.isActiveSnapp}
                    onChange={(e) =>
                      handleChangeInputs("isActiveSnapp", e.target.value)
                    }
                    defaultValue={50}
                    // getAriaValueText={`${10}°C`}
                    step={null}
                    marks={isActiveMarks}
                  />
                </Col>
              </Col>
            </Col>
          </Row>
        </Container>
      </Modal>
      <Toastify />
    </span>
  );
};

export default EditTables;
