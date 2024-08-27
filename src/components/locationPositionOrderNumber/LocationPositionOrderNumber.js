import React, { useEffect, useState } from "react";
import TableOrderNumb from "./TableOrderNumb";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Single from "./Single";
import StringHelpers, { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";
import Button from "../common/Buttons/Button";
import { Card, Col, Row } from "reactstrap";
import AllowedToOrder from "../allowedToOrder/AllowedToOrder";
import { styled } from "@mui/system";
import Tab from "@mui/material/Tab";
import { buttonClasses } from "@mui/base/Button";
import PropTypes from "prop-types";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import MainTitle from "../common/MainTitles/MailTitle";
import ComboBox from "../common/ComboBox";
import { useDispatch, useSelector } from "react-redux";
import Validation from "../../utiliy/validations";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import { selectLocationPositionOrderNumber } from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";

const LocationPositionOrderNumber = () => {
  const { users, main, companies } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [
    locationPositionOrderNumberGridData,
    setLocationPositionOrderNumberGridData,
  ] = useState(null);
  const [value, setValue] = useState("1");
  const [locationList, setLocationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [inputFields, setInputFields] = useState({});
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

  // const fn_updateGrid = asyncWrapper(async () => {
  //   if (this.state.stateDisable_show)
  //     this.setState({
  //       LocationPositionOrderNumberGridData:
  //         await locationPositionOrderNumberList(
  //           this.props.Company.currentCompanyId,
  //           this.props.User.token
  //         ),
  //     });
  // });

  const btnExportExcel = () => {
    Gfn_ExportToExcel(
      locationPositionOrderNumberGridData,
      "LocationPositionOrderNumber"
    );
  };

  const grdLocationPositionOrderNumber_onClickRow = (e) => {
    console.log(e);
    // ---------------------------------------------------------------------------------
    // const LOCATIONS = [{ id: e.data.locationId, label: e.data.locationName }];
    // this.setState({
    //   LocationList: LOCATIONS, //await location(e.data.locationId, this.props.User.token),
    // });
    // // ---------------------------------------------------------------------------------
    // this.fn_positionList(this.props.Company.currentCompanyId);
    // this.fn_locationGroupList(this.props.Company.currentCompanyId);
    setEditRow({
      txtMaxOrderNumberValue: e.data.maxOrderNumber,
      txtMaxOutRouteNumberValue: e.data.maxOutRouteNumber,
      txtMaxIncEditOrderNumberValue: e.data.maxIncEditOrderNumber,
      txtMaxNewInventoryOrderNumberValue: e.data.maxNewInventoryOrderNumber,
      txtMaxZeroInventoryOrderNumberValue: e.data.maxZeroInventoryOrderNumber,
      txtMaxDecEditSupplierOrderNumberValue:
        e.data.maxDecEditSupplierOrderNumber,
      txtMaxIncEditSupplierOrderNumberValue:
        e.data.maxIncEditSupplierOrderNumber,
      txtMaxNewSupplierOrderNumberValue: e.data.maxNewSupplierOrderNumber,
      txtMaxZeroSupplierOrderNumberValue: e.data.maxZeroSupplierOrderNumber,
      txtMaxOutRouteSupplierOrderNumberValue:
        e.data.maxOutRouteSupplierOrderNumber,
      stateUpdateDelete: true,
      RowSelected: e.data,
      PositionId: e.data.positionId,
      LocationGroupId: e.data.locationId,
      LocationId: e.data.locationId,
    });
  };

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(users?.userId);
    setLocationList(res?.data);
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

  const handleSearch = asyncWrapper(async () => {
    const postData = {
      locationIds: inputFields?.location?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.location, locationList)
        : inputFields?.location ||
          StringHelpers.fixComboListId([0], locationList),
      supplierIds: inputFields?.supplier?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.supplier, supplierList)
        : inputFields?.supplier ||
          StringHelpers.fixComboListId([0], supplierList),
      positionIds: inputFields?.position?.includes(0)
        ? StringHelpers.fixComboListId(inputFields?.location, positionList)
        : inputFields?.position ||
          StringHelpers.fixComboListId([0], positionList),
    };
    const res = await selectLocationPositionOrderNumber(postData);
    const { data, status, message } = res;
    if (status == "Success") {
      setLocationPositionOrderNumberGridData(data);
    } else {
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message || "لطفا دوباره امتحان کنید",
          Type: status,
        })
      );
    }
    console.log(res);
  });

  return (
    <>
      <MainTitle className="mt-4" label="تعداد مجاز سفارش فروشگاه‌ها" />
      <Card className="m-3 shadow bg-white border pointer">
        <Row className="m-2 standardPadding">
          <TabContext value={value}>
            <TabList
              onChange={(e, newValue) => setValue(newValue)}
              aria-label="lab API tabs example"
            >
              <Tab label="ثبت تکی" value="1" />
              <Tab label="ثبت گروهی" value="2" />
            </TabList>
            <TabPanel value="1">
              <Single
                editRow={editRow}
                LocationPositionOrderNumberGridData={
                  locationPositionOrderNumberGridData
                }
                setLocationPositionOrderNumberGridData={
                  setLocationPositionOrderNumberGridData
                }
              />
            </TabPanel>
            <TabPanel value="2">
              <AllowedToOrder />
            </TabPanel>
          </TabContext>
          <Row>
            <ComboBox
              name="location"
              multi
              label="فروشگاه"
              xxl={4}
              xl={4}
              options={locationList}
              onChange={handleChangeInputs}
              value={inputFields?.location}
            />
            <ComboBox
              name="position"
              multi
              xxl={4}
              xl={4}
              options={positionList}
              label="سمت"
              onChange={handleChangeInputs}
              value={inputFields?.position}
            />
            <ComboBox
              name="supplier"
              multi
              xxl={4}
              xl={4}
              options={supplierList}
              label="تامین کننده"
              onChange={handleChangeInputs}
              value={inputFields?.supplier}
            />
            <Col className="d-flex justify-content-end gap-2" xxl={12} xl={12}>
              <Button
                onClick={handleSearch}
                className="my-3"
                type="default"
                icon={<SearchIcon className="d-flex ms-2 font18" />}
                label="جستجو"
              />
              <Button
                icon={<ArticleIcon className="font18 ms-2" />}
                label="اکسل"
                className="my-3"
                type="default"
                stylingMode="contained"
                onClick={btnExportExcel}
              />
            </Col>
          </Row>
          <TableOrderNumb
            LocationPositionOrderNumberGridData={
              locationPositionOrderNumberGridData
            }
            grdLocationPositionOrderNumber_onClickRow={
              grdLocationPositionOrderNumber_onClickRow
            }
          />
        </Row>
      </Card>
    </>
  );
};

export default LocationPositionOrderNumber;
