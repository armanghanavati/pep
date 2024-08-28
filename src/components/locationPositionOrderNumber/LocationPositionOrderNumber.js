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

const LocationPositionOrderNumber = () => {
  const [value, setValue] = useState("1");

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
              <Single />
            </TabPanel>
            <TabPanel value="2">
              <AllowedToOrder />
            </TabPanel>
          </TabContext>
        </Row>
      </Card>
    </>
  );
};

export default LocationPositionOrderNumber;
