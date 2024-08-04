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

const EditTables = ({ filedFineds }) => {
  const dispatch = useDispatch();
  const [inputFields, setInputFields] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const location = useLocation();
  const [errors, setErrors] = useState({});
  const [allField, setAllField] = useState([]);
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
    let temp = [];
    const getValues = {
      value:
        fixFind === "int"
          ? inputFields?.input
          : fixFind === "bit"
          ? inputFields?.isActive
          : null,
      field: findValues?.[0]?.fieldName,
    };
    console.log(getValues);
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

  useEffect(() => {
    handleGetTableFields();
  }, []);

  return (
    <>
      <Button
        type="danger"
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
          <Button type="success" onClick={() => {}} label="تایید" />,
        ]}
      >
        <Container className="">
          <Row>
            <ComboBox
              name="fieldName"
              value={inputFields?.fieldName}
              onChange={(e) => handleChangeInputs("fieldName", e)}
              options={fixAllField}
              xxl={6}
              xl={6}
              label="انتخاب فیلد"
            />
            <Col
              className=" d-flex align-items-center justify-content-center"
              xl="6"
            >
              {fixFind === "bit" && (
                <Col className="mt-4 d-flex justify-content-center">
                  <SwitchCase
                    className="my-3"
                    name="isActive"
                    trueLabel="فعال"
                    falseLabel="غیر فعال"
                    onChange={(e) =>
                      handleChangeInputs("isActive", e.target.checked)
                    }
                    checked={inputFields?.isActive}
                    switcher
                  />
                </Col>
              )}
              {fixFind === "int" && (
                <Col>
                  <Input
                    type="number"
                    maxLength={30}
                    name="input"
                    onChange={handleChangeInputs}
                    value={inputFields?.input}
                    label="تکست را وارد کنید"
                    className=""
                    xxl="12"
                    xl="12"
                  />
                </Col>
              )}
            </Col>
          </Row>
          <div className="d-flex justify-content-center my-3">
            <Button
              onClick={handleShowFieldFined}
              disabled={!!inputFields?.fieldName ? false : true}
              type="default"
              label="ثبت موقت"
            />
          </div>
          <Col xxl="12">
            {showFieldFined &&
              filedFineds?.map((field) => {
                return <Col xxl="12">{field}</Col>;
              })}
          </Col>
        </Container>
      </Modal>
    </>
  );
};

export default EditTables;
