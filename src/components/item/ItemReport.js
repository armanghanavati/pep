import "../../assets/CSS/master_Style.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Form, Row } from "reactstrap";
import RangeSlider from "../../components/common/RangeSlider";
import ComboBox from "../common/ComboBox";
import Button from "../common/Buttons/Button";
import TableRF from "./ItemTable";
import asyncWrapper from "../../utiliy/asyncWrapper";
import {
  groupIds,
  groupProductList,
  slaPromotionList,
} from "../../redux/reducers/item/item-action";
import { storeGroup } from "../../redux/reducers/location/location-actions";
import StringHelpers from "../../utiliy/GlobalMethods";
import DataSource from "devextreme/data/data_source";
import Validation from "../../utiliy/validations";
<<<<<<< HEAD
<<<<<<< HEAD
import MainTitle from "../common/MainTitles/MailTitle";
import Wait from "../common/Wait";
=======
import Table from "../common/Tables/Table";
import { useSelector } from "react-redux";
>>>>>>> dev
=======
import Table from "../common/Tables/Table";
import { useSelector } from "react-redux";
=======
import MainTitle from "../common/MainTitles/MailTitle";
import Wait from "../common/Wait";
>>>>>>> 0d786d6d1bcf1eeb8f8cdacc066cdf7bc13663a4
>>>>>>> dev

const ItemReport = () => {
  const [storeList, setStoreList] = useState([]);
  const [inputFields, setInputFields] = useState({});
  const [errors, setErrors] = useState({});
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 25,
    },
  });
  const { users, companies } = useSelector((state) => state);
  console.log(companies);
  const [productGroupList, setProductGroupList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [stateWait, setStateWait] = useState(false);
  const [productListWithoutLazyLoading, setProductListWithoutLazyLoading] =
    useState([]);
  const [allListRF, setAllListRF] = useState([]);
  useEffect(() => {
    handleGroupProductList();
  }, []);
  useEffect(() => {
    if (companies?.currentCompanyId !== null) handleGroupStore();
  }, []);

  const handleGroupProductList = async () => {
    const res = await groupProductList();
    const { statusCode, data } = res;
    if (statusCode === 200) {
      setProductGroupList(data);
    }
  };

  const handleGroupStore = asyncWrapper(async () => {
    console.log(users?.userId, companies?.currentCompanyId);
    const res = await storeGroup(users?.userId, companies?.currentCompanyId);
    const { data, statusCode } = res;
    if (statusCode === 200) {
      setStoreList(data);
    }
  });

  const handleChangePageSize = (event) => {
    event.preventDefault();
    setTableParams({
      ...tableParams,
      pagination: {
        ...tableParams.pagination,
        pageSize: Number(event.target.value) || 0,
        current: 1,
      },
    });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

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
    if (name === "itProductGroup" && !!value) {
      if (value.includes(0)) {
        const fixLoop = StringHelpers.fixComboListId(
          inputFields?.itProductGroup,
          productGroupList
        );
        return handleProductGP(fixLoop);
      } else {
        return handleProductGP(value);
      }
    }
  };

  const handleProductGP = asyncWrapper(async (e) => {
    const res = await groupIds(e);
    console.log(res);
    const { data, statusCode } = res;
    console.log(data, statusCode);
    setProductListWithoutLazyLoading(data);
    if (statusCode === 200) {
      const LAZY = new DataSource({
        store: data,
        paginate: true,
        pageSize: 10,
      });
      setProductList(LAZY);
    }
  });

  const handleProduct = (e) => {
    handleChangeInputs("itsProductName", e);
  };

  const handleStoreGroup = (e) => {
    handleChangeInputs("storeGroup", e);
  };

  const DataGridCompanyColumns = [
    {
      dataField: 1,
      caption: "ردیف",
      allowEditing: false,
      render: (item, record, index) => (
        <>
          {index +
            1 +
            (Number(tableParams?.pagination?.current || 1) - 1) *
              Number(tableParams.pagination.pageSize || 1)}
        </>
      ),
    },
    {
      dataField: "locationName",
      caption: "فروشگاه",
      allowEditing: false,
    },
    {
      dataField: "itemGroup",
      caption: "گروه کالا",
      allowEditing: false,
    },
    {
      dataField: "itemName",
      caption: "نام کالا",
      allowEditing: false,
    }, 
    {
      dataField: "barcode1",
      caption: "بارکد1",
      allowEditing: false,
    },
    {
      dataField: "barcode2",
      caption: "بارکد2",
      allowEditing: false,
    },
    {
      dataField: "itemPerPack",
      caption: "تعداد در کارتن",
      allowEditing: false,
    },
       
    {
      dataField: "consumerPrice",
      caption: "قیمت مصرف کننده",
      allowEditing: false,
    },  
    {
      dataField: "discountPercent",
      caption: "درصد تخفیف",
      allowEditing: false,
    },  
    {
      dataField: "discountPrice",
      caption: "مبلغ تخفیف",
      allowEditing: false,
    }, 
    
    // {
    //   dataField: "weight",
    //   caption: "وزن واحد",
    //   allowEditing: false,
    // },
    // {
    //   dataField: "vat",
    //   caption: "مالیات بر ارزش افزوده",
    //   allowEditing: false,
    // },   
  ];

  const handleSearching = asyncWrapper(async () => {
    setStateWait(true)
    const postData = {
      itemIds: inputFields?.itsProductName?.includes(0)
        ? StringHelpers.fixComboListId(
            inputFields?.itsProductName,
            productListWithoutLazyLoading
          )
        : inputFields?.itsProductName,
      locationIds: inputFields?.storeGroup?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.storeGroup, storeList)
        : inputFields?.storeGroup,
      // itemIds: [0],
      // locationIds: [62],
      price: {
        low: inputFields?.consumerPrice?.[0] || 0,
        high: inputFields?.consumerPrice?.[1] || 1000000,
      },
      discount: {
        low: inputFields?.discountPercent?.[0] || 0,
        high: inputFields?.discountPercent?.[1] || 100,
      },
    };
    const res = await slaPromotionList(postData);
    setStateWait(false)
    const { statusCode, data } = res;    
    setAllListRF(data);
    
  });



  return (
    <Container fluid>
      <div className="bg-white px-2 rounded shadow">
        {/* <MainTitle label="ایجاد کالا" /> */}
        {stateWait && (
          <Row className="text-center">
            <Col style={{ textAlign: "center", marginTop: "10px" }}>
              <Wait />
            </Col>
          </Row>
        )}
        <Row className="mt-2">
          <Row>
            <ComboBox
              xxl={6}
              xl={6}
              multi
              valueExpr="id"
              className="my-2"
              label="گروه کالا:"
              // error={errors?.itProductGroup}
              // validations={[["decimal", 4]]}
              name="itProductGroup"
              value={inputFields?.itProductGroup}
              options={productGroupList}
              onChange={(e) => handleChangeInputs("itProductGroup", e)}
            />
            <ComboBox
              xxl={6}
              xl={6}
              multi
              className="my-2"
              label="نام کالا:"
              name="itsProductName"
              value={inputFields?.itsProductName}
              onChange={(e) => handleChangeInputs("itsProductName", e)}
              options={productList}
            />
          </Row>
          <Row>
            <ComboBox
              xxl={6}
              xl={6}
              multi
              className="my-2"
              label="گروه فروشگاه:"
              name="storeGroup"
              value={inputFields?.storeGroup}
              onChange={(e) => handleChangeInputs("storeGroup", e)}
              options={storeList}
            />
            <ComboBox
              xxl={6}
              xl={6}
              multi
              className="my-2"
              label="نام فروشگاه:"
              name="store"
              value={inputFields?.store}
              onChange={(e) => handleChangeInputs("store", e)}
              options={storeList}
            />
          </Row>
          <RangeSlider
            isCurrency
            name="consumerPrice"
            label="قیمت مصرف کننده:"
            valueLabelDisplay="auto"
            onChange={(e) =>
              handleChangeInputs("consumerPrice", e.target.value)
            }
            value={inputFields.consumerPrice || [0, 1000000]}
            min={0}
            max={1000000}
          />
          {/* <RangeSlider
            isCurrency
            name="discountPrice"
            label="مبلغ تخفیف:"
            valueLabelDisplay="auto"
            onChange={(e) =>
              handleChangeInputs("discountPrice", e.target.value)
            }
            value={inputFields.discountPrice || [0, 1000000]}
            min={0}
            max={1000000}
          /> */}
          <RangeSlider
            label="درصد تخفیف:"
            name="discountPercent"
            valueLabelDisplay="auto"
            getAriaLabel={() => "Temperature range"}
            onChange={(e) =>
              handleChangeInputs("discountPercent", e.target.value)
            }
            value={inputFields.discountPercent || [0, 100]}
            min={0}
            max={100}
          />
        </Row>
        <div className="d-flex justify-content-end mt-2">
          <Button
            onClick={handleSearching}
            icon={<i className="d-flex ms-2 bi bi-search" />}
            label="جستجو"
          />
        </div>
        <Table
          DataGridCompanyColumns={DataGridCompanyColumns}
          allListRF={allListRF}
        />
      </div>
    </Container>
  );
};

export default ItemReport;
