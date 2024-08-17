import React, { useEffect, useState } from "react";
import Table from "../common/Tables/Table";
import { Card, Container, ModalBody, ModalHeader, Row } from "reactstrap";
import asyncWrapper from "../../utiliy/asyncWrapper";

import { useDispatch, useSelector } from "react-redux";
import MainTitle from "../common/MainTitles/MailTitle";
import Toastify from "../common/Toasts/Toastify";

const AllowedToOrder = () => {
  const { users, main } = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {}, []);

  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="تعداد مجاز سفارش فروشگاه‌ها" />
        <Card className=" shadow bg-white border pointer">dsfdfsdf</Card>
        <Toastify />
      </Container>
    </>
  );
};

export default AllowedToOrder;
