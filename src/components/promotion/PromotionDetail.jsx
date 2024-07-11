import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Modal from "../common/Modals/Modal";
import Button from "../common/Buttons/Button";
import Input from "../common/Inputs/Input";
import Validation from "../../utiliy/validations";
import { TextField } from "@mui/material";
import DatePicker from "../common/DatePickers/DatePicker";
import SwitchCase from "../common/SwitchCases/SwitchCase";
import TableMultiSelect from "../common/Tables/TableMultiSelect";
import ComboBox from "../common/ComboBox";
import TextArea from "devextreme-react/text-area";
import Table from "../common/Tables/Table";
import AddIcon from "@mui/icons-material/Add";
import {
  slaPromotionPlatformList,
  slaPromotionTypeList,
} from "../../redux/reducers/promotion/promotion-action";
import asyncWrapper from "../../utiliy/asyncWrapper";
import CheckIcon from "@mui/icons-material/Check";
import PromotionProduct from "./PromotionProduct";
import StringHelpers from "../../utiliy/GlobalMethods";
import { groupIds } from "../../redux/reducers/item/item-action";
import { useSelector } from "react-redux";
import {
  locationPromotionList,
  storeGroup,
} from "../../redux/reducers/location/location-actions";

const PromotionDetail = ({
  detailRow,
  handleGetPromotionList,
  productList,
  showDetail,
  handleShowDetail,
  setProductList,
  setShowDetail,
}) => {
  const { users, companies } = useSelector((state) => state);
  const [inputFields, setInputFields] = useState({});
  const [errors, setErrors] = useState({});
  const [promotionTypeList, setPromotionTypeList] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [allgroupProduct, setAllgroupProduct] = useState([]);
  const [allProduct, setAllProduct] = useState([]);
  const [allPlatform, setAllPlatform] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [typeAndPlatform, setTypeAndPlatform] = useState({});

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
    if (name === "productGroup" && !!value) {
      if (value === 0) {
        const fixLoop = StringHelpers.fixComboListId(
          inputFields?.productGroup,
          allgroupProduct
        );
        return handleGroupIds(fixLoop);
      } else {
        return handleGroupIds(value);
      }
    }
  };

  const handleGroupIds = asyncWrapper(async (e) => {
    const eventFix = [e];
    const res = await groupIds(eventFix);
    const { data, statusCode } = res;
    if (statusCode == 200) {
      setAllProduct(data);
    }
  });

  const handleGetslaPromotionTypeList = asyncWrapper(async () => {
    const res = await slaPromotionTypeList();
    const { data, statusCode } = res;
    setPromotionTypeList(data);
  });

  const handleSlaPromotionPlatformList = asyncWrapper(async (id) => {
    const res = await slaPromotionPlatformList(id);
    const { data, statusCode } = res;
    if (statusCode == 200) {
      setAllPlatform(data);
    }
  });

  const handleGroupStore = asyncWrapper(async () => {
    const res = await locationPromotionList(detailRow?.data?.id, users?.userId);
    const { data, statusCode } = res;
    if (statusCode === 200) {
      setStoreList(data);
    }
  });

  const columnsProduct = [
    {
      dataField: "code",
      caption: "کد‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "barcode",
      caption: "بارکد‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "itemGroupName",
      caption: "گروه‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "itemName",
      caption: "نام‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "discount",
      caption: "درصد‌تخفیف‌ کالا",
      allowEditing: false,
    },
    {
      dataField: "operations",
      caption: "عملیات",
      allowEditing: false,
      cellRender: (cellData) => (
        <div>
          <span
            style={{ marginRight: 10, cursor: "pointer" }}
            onClick={() => alert("ssssss")}
          >
            sdfsdf
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => alert("ssssss")}>
            gggggg
          </span>
        </div>
      ),
    },
    {
      dataField: "operations",
      caption: "dddd",
      allowEditing: false,
      render: (cellData) => (
        <div>
          <span
            style={{ marginRight: 10, cursor: "pointer" }}
            onClick={() => alert("ssssss")}
          >
            sdfsdf
          </span>
          <span style={{ cursor: "pointer" }} onClick={() => alert("ssssss")}>
            gggggg
          </span>
        </div>
      ),
    },
  ];

  const platformColumns = [
    {
      dataField: "isChecked",
      caption: "",
      allowEditing: true,
    },
    {
      dataField: "code",
      caption: "کد‌",
      allowEditing: false,
    },
    {
      dataField: "platformName",
      caption: "عنوان",
      allowEditing: false,
    },
  ];

  const storeColumns = [
    {
      dataField: "isChecked",
      caption: "",
      allowEditing: true,
    },
    {
      dataField: "code",
      caption: "کد‌",
      allowEditing: false,
    },
    {
      dataField: "locationName",
      caption: "عنوان",
      allowEditing: false,
    },
  ];

  useEffect(() => {
    handleGetslaPromotionTypeList();
    handleSlaPromotionPlatformList(detailRow?.data?.id);
  }, []);

  useEffect(() => {
    if (companies?.currentCompanyId !== null) handleGroupStore();
  }, []);

  const handleAcceptGroup = () => {
    const fixAllPlatform = allPlatform
      ?.filter((platform) => platform?.isChecked === true)
      .map((item) => item.id);
    setTypeAndPlatform((prev) => ({ ...prev, fixAllPlatform }));
  };

  const handleAcceptStore = () => {
    const fixStoreList = storeList
      ?.filter((store) => store?.isChecked === true)
      .map((item) => item.id);
    setTypeAndPlatform((prev) => ({ ...prev, fixStoreList }));
  };

  console.log(typeAndPlatform, inputFields);

  const handleAcceptPromotion = asyncWrapper(async () => {
    const fixPlatform = typeAndPlatform?.fixAllPlatform?.map((item) => {
      return {
        slaPromotionPlatformId: item,
      };
    });
    const fixLocationPromotions = typeAndPlatform?.fixStoreList?.map((item) => {
      return {
        bseLocationId: item,
      };
    });
    const postData = {
      code: inputFields?.code,
      title: inputFields?.title,
      fromDate: inputFields?.fromDate,
      toDate: inputFields?.toDate,
      isActive: inputFields?.isActive,
      desc: inputFields?.desc,
      daysOffer: null,
      slaPromotionTypeId: inputFields?.typePromotion,
      slaPromotionDetails: [
        {
          itemId: 0,
          discount: 0,
          consumerPrice: 0,
          priceWithDiscount: 0,
        },
      ],
      slaPromotionPlatformPromotions: fixPlatform,
      accLocationPromotions: fixLocationPromotions,
    };
    // const res = await
  });

  console.log(inputFields);

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
          <Button
            onClick={handleAcceptPromotion}
            text="success"
            stylingMode="success"
            type="success"
            icon={<CheckIcon className="ms-1 font18 fw-bold" />}
            label="تایید"
          />
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
            onChange={(e) => handleChangeInputs("isActive", e.target.checked)}
            checked={inputFields?.isActive}
            switcher
            // value={inputFields?.isActive}
          />
        </Col>
        <DatePicker
          onChange={(e) => handleChangeInputs("itsFromDate", e)}
          name="itsFromDate"
          value={inputFields?.fromDate}
          className="my-3"
          minDate={Date.now()}
          xxl={4}
          label="از تاریخ"
        />
        <DatePicker
          minDate={Date.now()}
          name="itsToDate"
          value={inputFields?.itsToDate}
          onChange={(e) => handleChangeInputs("itsToDate", e)}
          className="my-3"
          xxl={4}
          label="تا تاریخ"
        />
        <Input
          type="number"
          name="daysOffer"
          value={inputFields?.daysOffer}
          onChange={handleChangeInputs}
          maxLength={1}
          className="my-2"
          xxl={3}
          label="روز‌مجاز‌ ویرایش"
        />
        <Row className="">
          <Col className=" me-4 d-flex justify-content-start" xxl={4} xl={12}>
            <TableMultiSelect
              submit={handleAcceptGroup}
              allListRF={allPlatform}
              columns={platformColumns}
              className="m-3"
              xxl={12}
              xl={2}
              label="دسته"
            />
          </Col>
          <Col className=" me-3 d-flex justify-content-start" xxl={4} xl={12}>
            <TableMultiSelect
              submit={handleAcceptStore}
              allListRF={storeList}
              columns={storeColumns}
              className="my-3"
              xxl={12}
              xl={2}
              label="فروشگاه"
            />
          </Col>
          <ComboBox
            name="typePromotion"
            displayExpr="typeName"
            options={promotionTypeList}
            value={inputFields?.typePromotion}
            onChange={(e) => handleChangeInputs("typePromotion", e)}
            placeholder="نوع"
            label="نوع"
            className="me-2 my-3 d-flex align-items-start"
            xl={3}
            xxl={5}
          />
        </Row>
        <Col className="my-3" xxl="11">
          <TextArea
            name="desc"
            value={inputFields?.desc}
            onChange={(e) => handleChangeInputs("desc", e)}
            rtlEnabled
            placeholder="توضیحات"
          />
        </Col>
        <Col xxl="11" className="">
          <Button
            onClick={() => setShowAddProduct(true)}
            icon={<AddIcon className="ms-1 fw-bold" />}
            text="success"
            stylingMode="success"
            type="success"
            label="افزودن کالا"
          />
        </Col>
        <Col xxl="11" className="">
          <Table allListRF={productList} columns={columnsProduct} filterRow />
        </Col>
      </Row>
      {showAddProduct && (
        <PromotionProduct
          handleGetPromotionList={handleGetPromotionList}
          detailRow={detailRow}
          setProductList={setProductList}
          allProduct={allProduct}
          handleChangeInputs={handleChangeInputs}
          showAddProduct={showAddProduct}
          setShowAddProduct={setShowAddProduct}
          inputFields={inputFields}
          allgroupProduct={allgroupProduct}
          setAllgroupProduct={setAllgroupProduct}
        />
      )}
    </Modal>
  );
};

export default PromotionDetail;
