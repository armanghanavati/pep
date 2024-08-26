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
import GroupDelete from "./GroupDelete";
import DeleteIcon from "@mui/icons-material/Delete";

const AllowedToOrder = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [isEditFields, setIsEditFields] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <div className="m-2">
        <div className="d-flex mb-2 gap-2">
          <Button
            onClick={() => {
              setIsEditFields(false);
              setShowAdd(true);
            }}
            type="success"
            icon={<AddIcon className="ms-1 font18 fw-bold" />}
            label="افزودن گروهی"
          />
          <Button
            onClick={() => setShowDelete(true)}
            type="success"
            icon={<DeleteIcon className="ms-1 font18 fw-bold" />}
            label="حذف گروهی"
          />
          <Button
            type="success"
            onClick={() => {
              setIsEditFields(true);
              setShowAdd(true);
            }}
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
      </div>
      {showCopy && (
        <GroupCopy
          isEditFields={isEditFields}
          locPosSupp={true}
          showCopy={showCopy}
          setShowCopy={setShowCopy}
        />
      )}
      {showDelete && (
        <GroupDelete
          isEditFields={isEditFields}
          locPosSupp={true}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
        />
      )}
      {showAdd && (
        <GroupAdd
          isEditFields={isEditFields}
          locPosSupp={true}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
        />
      )}
      <Toastify />
    </>
  );
};

export default AllowedToOrder;
