import React, { useState } from "react";
import TableOrderNumb from "./TableOrderNumb";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Single from "./Single";
import { locationPositionOrderNumberList } from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import { Gfn_ExportToExcel } from "../../utiliy/GlobalMethods";
import Button from "../common/Buttons/Button";
import { Card, Row } from "reactstrap";
import AllowedToOrder from "../allowedToOrder/AllowedToOrder";
import { styled } from "@mui/system";
import Tab from "@mui/material/Tab";
import { buttonClasses } from "@mui/base/Button";
import PropTypes from "prop-types";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const LocationPositionOrderNumber = () => {
  const [
    locationPositionOrderNumberGridData,
    setLocationPositionOrderNumberGridData,
  ] = useState(null);
  const [value, setValue] = useState("1");

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

  const btnExportExcel_onClick = () => {
    Gfn_ExportToExcel(
      locationPositionOrderNumberGridData,
      "LocationPositionOrderNumber"
    );
  };

  // const grdLocationPositionOrderNumber_onClickRow = (e) => {
  //   const LOCATIONS = [{ id: e.data.locationId, label: e.data.locationName }];
  //   this.setState({
  //     LocationList: LOCATIONS, //await location(e.data.locationId, this.props.User.token),
  //   });
  //   // this.fn_positionList(this.props.Company.currentCompanyId);
  //   // this.fn_locationGroupList(this.props.Company.currentCompanyId);
  //   this.setState({
  //     txtMaxOrderNumberValue: e.data.maxOrderNumber,
  //     txtMaxOutRouteNumberValue: e.data.maxOutRouteNumber,
  //     txtMaxIncEditOrderNumberValue: e.data.maxIncEditOrderNumber,
  //     txtMaxNewInventoryOrderNumberValue: e.data.maxNewInventoryOrderNumber,
  //     txtMaxZeroInventoryOrderNumberValue: e.data.maxZeroInventoryOrderNumber,
  //     txtMaxDecEditSupplierOrderNumberValue:
  //       e.data.maxDecEditSupplierOrderNumber,
  //     txtMaxIncEditSupplierOrderNumberValue:
  //       e.data.maxIncEditSupplierOrderNumber,
  //     txtMaxNewSupplierOrderNumberValue: e.data.maxNewSupplierOrderNumber,
  //     txtMaxZeroSupplierOrderNumberValue: e.data.maxZeroSupplierOrderNumber,
  //     txtMaxOutRouteSupplierOrderNumberValue:
  //       e.data.maxOutRouteSupplierOrderNumber,
  //     stateUpdateDelete: true,
  //     RowSelected: e.data,
  //     PositionId: e.data.positionId,
  //     LocationGroupId: e.data.locationId,
  //     LocationId: e.data.locationId,
  //   });
  // };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Card className="m-3 shadow bg-white border pointer">
      <Row className="m-2 standardPadding">
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="ثبت تکی" value="1" />
            <Tab label="ثبت گروهی" value="2" />
          </TabList>
          <TabPanel value="1">
            <Single
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
        <TableOrderNumb
          LocationPositionOrderNumberGridData={
            locationPositionOrderNumberGridData
          }
          // grdLocationPositionOrderNumber_onClickRow={
          //   grdLocationPositionOrderNumber_onClickRow
          // }
          btnExportExcel_onClick={btnExportExcel_onClick}
        />
      </Row>
    </Card>
  );
};

export default LocationPositionOrderNumber;
