import React, { useEffect, useState } from "react";
import { Card, Col, Container, ModalBody, ModalHeader, Row } from "reactstrap";
import asyncWrapper from "../../utiliy/asyncWrapper";
import Button from "../common/Buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import MainTitle from "../common/MainTitles/MailTitle";
import Toastify from "../common/Toasts/Toastify";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ComboBox from "../common/ComboBox";
import AddIcon from "@mui/icons-material/Add";
import GroupCopy from "./GroupCopy";
import GroupEdit from "./GroupEdit";
import GroupAdd from "./GroupAdd";
import Table from "../common/Tables/Table";
import { Gfn_FormatNumber } from "../../utiliy/GlobalMethods";

const AllowedToOrder = () => {
  const { users, main } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showCopy, setShowCopy] = useState(false);

  useEffect(() => {}, []);

  const columns = [
    {
      dataField: 1,
      caption: "ردیف",
      allowEditing: false,
      cellRender: (item) => {
        return <>{item?.row?.dataIndex + 1}</>;
      },
    },
    {
      dataField: "LocationId",
      caption: "فروشگاه",
      allowEditing: false,
    },
    {
      dataField: "PositionId",
      caption: "سمت",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.PositionId)}</>;
      },
    },
    {
      dataField: "SupplierId",
      caption: "تامین کننده",
      allowEditing: false,
    },
    {
      dataField: "maxOrderNumber",
      caption: "تعداد مجاز ویرایش (کاهش دادن) سفارش انباری",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.maxOrderNumber)}</>;
      },
    },
    {
      dataField: "MaxIncEditOrderNumber",
      caption: "تعداد مجاز ویرایش (افزایش دادن) سفارش انباری",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.MaxIncEditOrderNumber)}</>;
      },
    },
    {
      dataField: "maxOrderWeight",
      caption: "تعداد مجاز سفارش جدید انباری",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.maxOrderWeight)}</>;
      },
    },
    {
      dataField: "minOrderNumber",
      caption: "حداقل تعداد",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.minOrderNumber)}</>;
      },
    },
    {
      dataField: "minOrderRiali",
      caption: "حداقل ریال",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.minOrderRiali)}</>;
      },
    },
    {
      dataField: "maxOrderRiali",
      caption: "حداکثر ریال",
      allowEditing: false,
      cellRender: ({ data }) => {
        return <>{Gfn_FormatNumber(data?.maxOrderRiali)}</>;
      },
    },
    // {
    //   caption: "عملیات",
    //   allowEditing: true,
    //   cellRender: (data) => {
    //     console.log(data?.row?.data);
    //     return (
    //       <>
    //         <DeleteIcon className="font18 fw-bold text-primary cursorPointer" />
    //       </>
    //     );
    //   },
    // },
  ];

  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="تعداد مجاز سفارش فروشگاه‌ها" />
        <Card className=" shadow bg-white border pointer">
          <div className="m-2">
            {/* <ComboBox
              multi
              label="فروشگاه "
              xxl={12}
              xl={12}
              //   options={locationList}
              //   onChange={cmbLocationList}
              //   value={location}
              className="my-2"
            />
            <ComboBox
              multi
              //   options={supplierList}
              label="تامین کنندگان"
              //   onValueChange={handleGroupListBySupplier}
              //   value={supplier}
              className="my-2"
            />
            <ComboBox
              multi
              //   options={supplierList}
              label="تامین کنندگان"
              //   onValueChange={handleGroupListBySupplier}
              //   value={supplier}
              className="my-2"
            /> */}
            <div className="d-flex gap-3">
              <Button
                onClick={() => setShowAdd(true)}
                type="success"
                icon={<AddIcon className="ms-1 font18 fw-bold" />}
                label="افزودن"
              />
              <Button
                type="success"
                onClick={() => setShowEdit(true)}
                icon={<EditIcon className="font18" />}
                label="ویرایش گروهی"
                className=""
              />
              <Button
                onClick={() => setShowCopy(true)}
                className=""
                icon={<ContentCopyIcon className="ms-1 font18 fw-bold" />}
                label="کپی گروهی"
                type="success"
                rtlEnabled={true}
              />
            </div>
            <Table
              filterRow
              headerFilter
              //   onRowClick={!!permission && handleOnRowClick}
              columns={columns}
              allListRF={["allLocationSupplier"]}
            />
          </div>
        </Card>
        {showCopy && (
          <GroupCopy showCopy={showCopy} setShowCopy={setShowCopy} />
        )}
        {showEdit && (
          <GroupEdit showEdit={showEdit} setShowEdit={setShowEdit} />
        )}
        {showAdd && <GroupAdd showAdd={showAdd} setShowAdd={setShowAdd} />}
        <Toastify />
      </Container>
    </>
  );
};

export default AllowedToOrder;
