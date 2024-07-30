import React, { useState } from "react";
import PromotionCommonDetail from "../common/PromotionCommonDetail";
import { Card, Col, Container, Row } from "reactstrap";
import MainTitle from "../common/MainTitles/MailTitle";
import Table from "../common/Tables/Table";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Button from "../common/Buttons/Button";
import { slaPromotionReport } from "../../redux/reducers/promotion/promotion-action";
import StringHelpers, { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";
import { useDispatch, useSelector } from "react-redux";
import TableMultiSelect2 from "../common/Tables/TableMultiSelect2";
import Input from "../common/Inputs/Input";
import SearchIcon from "@mui/icons-material/Search";
import { RsetIsLoading } from "../../redux/reducers/main/main-slice";
import ArticleIcon from "@mui/icons-material/Article";

const PromotionReport = () => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state);
  const [inputFields, setInputFields] = useState({});
  const [typeAndPlatform, setTypeAndPlatform] = useState({});
  const [selectedType, setSelectedType] = useState([]);
  const [selectStore, setSelectStore] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState([]);
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
  };

  const handleSearching = asyncWrapper(async () => {
    const fixLocation = typeAndPlatform?.allStore.map(
      (location) => location.id
    );
    const fixAllType = typeAndPlatform?.allType?.map((type) => type.id);
    const fixPlatform = typeAndPlatform?.platform?.map((item) => item.id);
    const fixAllProduct = typeAndPlatform?.allProduct?.map((item) => item.id);
    const fixAllCustomer = typeAndPlatform?.allCustomer?.map((item) => item.id);

    const postData = {
      userId: users?.userId,
      title: inputFields?.title || "",
      itemIds: selectedProduct?.length !== 0 ? selectedProduct : fixAllProduct,
      locationIds: typeAndPlatform?.store || fixLocation,
      promotionTypeIds: !!inputFields?.typePromotion
        ? [inputFields?.typePromotion]
        : fixAllType,
      promotionPaltformIds: typeAndPlatform?.type || fixPlatform,
      promotionCustomerGroupIds: typeAndPlatform?.customer || fixAllCustomer,
      fromDate:
        StringHelpers?.convertDateEnWithoutTime(inputFields?.itsFromDate) ||
        null,
      toDate:
        StringHelpers?.convertDateEnWithoutTime(inputFields?.itsToDate) || null,
      discount: inputFields?.discount,
    };
    dispatch(RsetIsLoading({ stateWait: true }));
    const res = await slaPromotionReport(postData);
    dispatch(RsetIsLoading({ stateWait: false }));

    const { statusCode, data } = res;
    setAllListRF(data);
  });

  const promotionColumns = [
    {
      dataField: 1,
      caption: "ردیف",
      allowEditing: false,
      cellRender: (item) => {
        return <>{item?.row?.dataIndex + 1}</>;
      },
    },
    {
      dataField: "title",
      caption: "عنوان",
      allowEditing: true,
    },
    {
      dataField: "fromDate",
      caption: "از تاریخ",
      allowEditing: false,
    },

    {
      dataField: "toDate",
      caption: "تا تاریخ",
      allowEditing: false,
    },
    {
      dataField: "plaformName",
      caption: "دسته",
      allowEditing: false,
    },

    {
      dataField: "locationName",
      caption: "فروشگاه",
      allowEditing: false,
    },
    {
      dataField: "itemName",
      caption: "کالا",
      allowEditing: false,
    },
    {
      dataField: "barcode1",
      caption: "بارکد",
      allowEditing: true,
    },
    {
      dataField: "discount",
      caption: "درصد تخفیف",
      allowEditing: true,
      cellRender: (item) => {
        return <>{item?.key?.discount + "%"}</>;
      },
    },
    {
      dataField: "typeName",
      caption: "عمومی",
      allowEditing: true,
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
            selectedPlatform={selectedPlatform}
            setSelectedPlatform={setSelectedPlatform}
          />
          <div className="d-flex justify-content-end mt-2">
            <Button
              className="ms-3"
              onClick={handleSearching}
              icon={<SearchIcon className="d-flex ms-2 font18" />}
              label="جستجو"
            />
            <Button
              icon={<ArticleIcon className="font18 fwbold ms-2" />}
              className="bg-danger "
              label="اکسل"
              stylingMode="contained"
              rtlEnabled={true}
              onClick={() => Gfn_ExportToExcel(allListRF, "promotion-report")}
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
