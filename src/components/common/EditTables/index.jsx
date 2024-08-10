import React, { useEffect, useState } from "react";
import Modal from "../Modals/Modal";
import Button from "../Buttons/Button";
import { Col, Container, Row } from "reactstrap";
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
import { RsetShowToast } from "../../../redux/reducers/main/main-slice";
import { useDispatch } from "react-redux";
import { updateItemLocationGroup } from "../../../redux/reducers/location/location-actions";
import StringHelpers from "../../../utiliy/GlobalMethods";

const EditTables = ({
  mulltiComponents,
  filedFineds,
  allState,
  optionFieldFind,
  valueFieldFind,
}) => {
  const dispatch = useDispatch();
  const [inputFields, setInputFields] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [allField, setAllField] = useState([]);
  const [getFieldValues, setGetFieldValues] = useState([]);
  // const [selectedLocation, setSelectedLocation] = useState([]);
  // const [getLocation, setGetLocation] = useState([]);
  const [showFieldFined, setShowFieldFined] = useState(false);
  const [fieldNames, setFieldNames] = useState([
    {
      id: 2,
      fieldName: "isActive",
      caption: "فعال",
      dataType: "boolean",
    },
    {
      id: 3,
      fieldName: "minChanger",
      caption: "حداکثر درصد فروش",
      dataType: "number",
    },
  ]);
  const [getFieldNames, setGetFieldNames] = useState(null);
  const findValues = allField?.filter((field) => {
    return inputFields?.fieldName === field?.id;
  });
  const fixFind = findValues?.[0]?.dataType;
  const fixAllField = allField?.map((field) => {
    return {
      id: field?.id,
      label: field?.caption,
    };
  });

  const allLocationData =
    mulltiComponents?.[0]?.props?.children?.[0]?.props?.children?.[1]?.props
      ?.dataSource;

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
    console.log(value);
  };

  const handleShowFieldFined = () => {
    setShowFieldFined(true);
    const data = {
      value:
        fixFind === "int"
          ? inputFields?.input
          : fixFind === "bit"
          ? inputFields?.isActive
          : null,
      field: findValues?.[0]?.fieldName,
    };
    // temp.push(...data);
    setGetFieldValues((prev) => [...prev, data]);
  };

  const handleGetTableFields = asyncWrapper(async () => {
    // const res = await getTableFields(location?.pathname?.split("/")?.[1]);
    const res = await getTableFields("itemLocations");
    console.log(res);
    const { data, status, message } = res;
    if (status == "Success") {
      console.log(data);
      setAllField(data);
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

  const test = mulltiComponents?.map((item) => {
    return item;
  });

  const fixTest = () => {
    const captions = test?.map((item) => {
      return {
        caption: item?.label,
        data: { id: item?.selected },
      };
    });

    return captions;
  };

  console.log(fixTest(), test);

  useEffect(() => {
    handleGetTableFields();
  }, []);

  const fixFieldFindForValues = filedFineds?.map((item) => {
    return {
      values: item?.props?.value,
    };
  });

  const handleAcceptEditTable = async () => {
    console.log(allState?.[0]?.itemLocByLocIdValue.includes(0));
    const postData = {
      itemIds: allState?.[0]?.itemLocByLocIdValue.includes(0)
        ? StringHelpers.fixComboListId(
            allState?.[0]?.itemLocByLocIdValue,
            allLocationData
          )
        : allState?.[0]?.itemLocByLocIdValue,
      locationIds: allState?.[0]?.locationIds,
      inventoryIds: allState?.[0]?.inventoryId,
      isActive: inputFields?.isActive,
      maxPercentChange: inputFields?.maxPercentChange,
      minPercentChange: inputFields?.minPercentChange,
      isCreateOrderInventory: inputFields?.isCreateOrderInventory,
      isCreateOrderSupplier: inputFields?.isCreateOrderSupplier,
      orderNumber: inputFields?.orderNumber,
      isActiveSnapp: inputFields?.isActiveSnapp,
      isSentToSnapp: inputFields?.isSentToSnapp,
      maxAllowOrderNumberSnapp: inputFields?.maxAllowOrderNumberSnapp,
      allowNewOrderInventory: inputFields?.allowNewOrderInventory,
    };

    const res = await updateItemLocationGroup(postData);
    console.log(res);
  };

  // [
  //   { caption : "فروشگاه" ,  data:[{id , itemName}]},
  //   { caption : "کالا" ,  data:[{id , itemName}]}
  // ]
  
  return (
    <span>
      <Button
        type="success"
        onClick={() => setShowEditModal(true)}
        label="ویرایش جدول"
      />
      <Modal
        size="lg"
        label={"ویرایش"}
        classHeader="bg-white"
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
          <Row className=" d-flex align-items-center justify-content-center">
            <Col className="my-2" xl="6" xxl="6">
              <Input
                className="fw-normal"
                type="number"
                maxLength={30}
                name="maxPercentChange"
                onChange={handleChangeInputs}
                value={inputFields?.maxPercentChange}
                label="حداکثر درصد تغییر"
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
                label="حداقل درصد تغییر"
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
                label="شماره سفارش"
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
                label="شماره مجاز حداکثر سفارش اسنپ"
                xxl="12"
                xl="12"
              />
            </Col>
          </Row>
          <Row>
            <Col xl="6" xxl="6" className="mt-4 d-flex">
              <SwitchCase
                className=""
                name="isActive"
                onChange={(e) =>
                  handleChangeInputs("isActive", e.target.checked)
                }
                checked={inputFields?.isActive}
              />
              <div className="mx-2">فعال</div>
            </Col>
            <Col xl="6" xxl="6" className="mt-4 d-flex">
              <SwitchCase
                className=""
                name="isCreateOrderInventory"
                onChange={(e) =>
                  handleChangeInputs("isCreateOrderInventory", e.target.checked)
                }
                checked={inputFields?.isCreateOrderInventory}
              />
              <div className="mx-2">موجودی سفارش</div>
            </Col>
            <Col xl="6" xxl="6" className="mt-4 d-flex">
              <SwitchCase
                className=""
                name="isSentToSnapp"
                onChange={(e) =>
                  handleChangeInputs("isSentToSnapp", e.target.checked)
                }
                checked={inputFields?.isSentToSnapp}
              />
              <div className="mx-2">ارسال برای اسنپ</div>
            </Col>
            <Col xl="6" xxl="6" className="mt-4 d-flex">
              <SwitchCase
                className=""
                name="isCreateOrderSupplier"
                onChange={(e) =>
                  handleChangeInputs("isCreateOrderSupplier", e.target.checked)
                }
                checked={inputFields?.isCreateOrderSupplier}
              />
              <div className="mx-2"> تامین کننده سفارش</div>
            </Col>
            <Col xl="6" xxl="6" className="mt-4 d-flex">
              <SwitchCase
                className=""
                name="allowNewOrderInventory"
                onChange={(e) =>
                  handleChangeInputs("allowNewOrderInventory", e.target.checked)
                }
                checked={inputFields?.allowNewOrderInventory}
              />
              <div className="mx-2">سفارش مجاز</div>
            </Col>
            <Col xl="6" xxl="6" className="mt-4 d-flex">
              <SwitchCase
                className=""
                name="isActiveSnapp"
                onChange={(e) =>
                  handleChangeInputs("isActiveSnapp", e.target.checked)
                }
                checked={inputFields?.isActiveSnapp}
              />
              <div className="mx-2">فعال برای اسنپ</div>
            </Col>
          </Row>
        </Container>
      </Modal>
    </span>
  );
};

export default EditTables;
