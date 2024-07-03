import React, { useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import Input from "../common/Inputs/Input";
import Validation from "../../utiliy/validations";
import { TextField } from "@mui/material";
// import DatePicker from "../common/DatePickers/Datepicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AdapterJalali from "@date-io/date-fns-jalali";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import DatePicker from "../common/DatePickers/DatePicker";
import SwitchCase from "../common/SwitchCases/SwitchCase";
import TableMultiSelect from "../common/Tables/TableMultiSelect";
import ComboBox from "../common/ComboBox";
import TextArea from "devextreme-react/text-area";
import Table from "../common/Tables/Table";
import AddIcon from "@mui/icons-material/Add";

const PromotionDetail = ({ showDetail, handleShowDetail, setShowDetail }) => {
  const [inputFields, setInputFields] = useState({});
  const [inDate, setInDate] = useState({});
  const [errors, setErrors] = useState({});

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

  const columnsProduct = [
    {
      dataField: "code",
      caption: "کد‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "code",
      caption: "بارکد‌ کالا",
      allowEditing: false,
    },
    {
      caption: "گروه‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "code",
      caption: "نام‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "code",
      caption: "درصد‌تخفیف‌ کالا",
      allowEditing: false,
    },
  ];

  const groupProductCol = [
    {
      dataField: "code",
      caption: "کد‌",
      allowEditing: false,
    },
    {
      dataField: "title",
      caption: "عنوان",
      allowEditing: false,
    },
  ];

  const groupProductList = [
    {
      id: "1",
      title: "مرغ",
      code: "123",
    },
    {
      id: "2",
      title: "گوشت",
      code: "1597",
    },
  ];

  return (
    <Modal
      size="xl"
      onClose={handleShowDetail}
      label="پروموشن"
      isOpen={showDetail}
      footerButtons={[
        <>
          <Button
            text="Outlined"
            stylingMode="outlined"
            type="danger"
            onClick={() => setShowDetail(false)}
            label="لغو"
          />
          <Button onClick={() => setShowDetail(false)} label="تایید" />
        </>,
      ]}
    >
      <Row className="d-flex justify-content-center">
        <Input
          xxl={4}
          className="my-3"
          name="code"
          onChange={handleChangeInputs}
          value={inputFields?.code}
          label="کد"
        />
        <Input
          xxl={4}
          className="my-3"
          name="title"
          onChange={handleChangeInputs}
          value={inputFields?.title}
          label="عنوان"
        />
        <Col
          xl="3"
          xxl="3"
          className="d-flex align-items-center justify-content-center"
        >
          <SwitchCase
            className="my-3"
            name="isActive"
            trueLabel="فعال"
            falseLabel="غیر فعال"
            onChange={handleChangeInputs}
            switcher
            value={inputFields?.isActive}
          />
        </Col>
        <DatePicker className="my-3" xxl={4} label="از تاریخ" />
        <DatePicker className="my-3" xxl={4} label="تا تاریخ" />
        <Input className="my-2" xxl={3} label="روز‌مجاز‌ ویرایش" />
        <Row className="">
          <Col className=" me-4 d-flex justify-content-start" xxl={4} xl={12}>
            <TableMultiSelect
              allListRF={groupProductList}
              columns={groupProductCol}
              className="m-3"
              xxl={12}
              xl={2}
              label="دسته"
            />
          </Col>
          <Col className=" me-3 d-flex justify-content-start" xxl={4} xl={12}>
            <TableMultiSelect
              className="my-3"
              xxl={12}
              xl={2}
              label="فروشگاه"
            />
          </Col>
          <ComboBox
            placeholder="نوع"
            label="نوع"
            className="me-2 my-3 d-flex align-items-start"
            xl={3}
            xxl={5}
          />
        </Row>
        <Col className="my-3" xxl="11">
          <TextArea rtlEnabled className="" placeholder="توضیحات" />
        </Col>
        <Col xxl="11" className="">
          <Button
            icon={<AddIcon className="ms-1 fw-bold" />}
            text="success"
            stylingMode="success"
            type="success"
            label="افزودن کالا"
          />
        </Col>
        <Col xxl="11" className="">
          <Table columns={columnsProduct} />
        </Col>
      </Row>
    </Modal>
  );
};

export default PromotionDetail;
