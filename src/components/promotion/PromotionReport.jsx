import React, { useState } from "react";
import PromotionCommonDetail from "../common/PromotionCommonDetail";
import { Card, Col, Container, Row } from "reactstrap";
import MainTitle from "../common/MainTitles/MailTitle";
import Table from "../common/Tables/Table";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Button from "../common/Buttons/Button";
import { slaPromotionReport } from "../../redux/reducers/promotion/promotion-action";
import StringHelpers from "../../utiliy/GlobalMethods";
import { useSelector } from "react-redux";
import TableMultiSelect2 from "../common/Tables/TableMultiSelect2";
import Input from "../common/Inputs/Input";

const PromotionReport = () => {
  const { users } = useSelector((state) => state);
  const [inputFields, setInputFields] = useState({});
  const [typeAndPlatform, setTypeAndPlatform] = useState({});
  const [selectedType, setSelectedType] = useState([]);
  const [selectStore, setSelectStore] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);

  const [allListRF, setAllListRF] = useState([]);

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
  };

  const handleSearching = asyncWrapper(async () => {
    console.log([inputFields?.typePromotion]);
    const postData = {
      userId: users?.userId,
      title: inputFields?.title || null,
      itemIds: selectedProduct,
      locationIds: typeAndPlatform?.store,
      promotionTypeIds: [inputFields?.typePromotion],
      promotionPaltformIds: typeAndPlatform?.type,
      promotionCustomerGroupIds: typeAndPlatform?.customer,
      fromDate: StringHelpers?.convertDateEn(inputFields?.itsFromDate),
      toDate: StringHelpers?.convertDateEn(inputFields?.itsToDate),
      discount: inputFields?.discount,
    };
    const res = await slaPromotionReport(postData);
    console.log(res);
    const { statusCode, data } = res;
    setAllListRF(data);
  });

  const promotionColumns = [
    {
      dataField: "barcode",
      caption: "عنوان",
      allowEditing: true,
    },
    {
      dataField: "itemGroupName",
      caption: "از تاریخ",
      allowEditing: false,
    },
    {
      dataField: "itemName",
      caption: "تا تاریخ",
      allowEditing: false,
    },
    {
      dataField: "itemName",
      caption: "",
      allowEditing: false,
    },
  ];

  return (
    <Container fluid className="mt-4">
      <MainTitle label="گزارش پروموشن ها" />
      <Card className=" shadow bg-white border pointer">
        <div className="mt-3 mx-3">
          <PromotionCommonDetail
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
            itsPromotionReport={true}
            handleChangeInputs={handleChangeInputs}
            inputFields={inputFields}
            setInputFields={setInputFields}
            typeAndPlatform={typeAndPlatform}
            setTypeAndPlatform={setTypeAndPlatform}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectStore={selectStore}
            setSelectStore={setSelectStore}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
          <div className="d-flex justify-content-end mt-2">
            <Button
              onClick={handleSearching}
              icon={<i className="d-flex ms-2 bi bi-search" />}
              label="جستجو"
            />
          </div>
        </div>
        <Row className="standardPadding">
          <Table
            headerFilter
            columns={promotionColumns}
            allListRF={allListRF}
          />
        </Row>
      </Card>
    </Container>
  );
};

export default PromotionReport;
