import React, { useEffect, useState } from "react";
import Table from "../common/Tables/Table";
import { Card, Container, ModalBody, ModalHeader, Row } from "reactstrap";
import Button from "../common/Buttons/Button";
import AddIcon from "@mui/icons-material/Add";
import MainTitle from "../common/MainTitles/MailTitle";
import Toastify from "../common/Toasts/Toastify";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";
import HdrWeakIcon from "@mui/icons-material/HdrWeak";
const index = () => {
  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="تامین کننده فروشگاه‌ها" />
        <Card className=" shadow bg-white border pointer">
          <div className="mt-2 d-flex justify-content-between mx-2">
            <div className="gap-3">
              <Button
                className="mx-2"
                type="success"
                //   onClick={handleShowDetail}
                label="مبداء"
              />
              <Button
                type="success"
                //   onClick={handleShowDetail}
                label="مقصد"
              />
            </div>
            <div>
              <Button
                icon={<ContentCopyIcon className="ms-1 font18 fw-bold" />}
                //   onClick={handleShowDetail}
                label="کپی"
              />
            </div>
          </div>
          <Row className="standardPadding">
            <Table
              //   selectedRowKeys={selectedRowKeys}
              //   onSelectionChanged={onSelectionChanged}
              headerFilter
              //   onRowClick={handleOnRowClick}
              //   columns={columns}
              allListRF={["promotionList"]}
            />
          </Row>
        </Card>
        <Toastify />
      </Container>
    </>
  );
};

export default index;
