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
import SearchIcon from "@mui/icons-material/Search";
import GroupDelete from "./GroupDelete";
import DeleteIcon from "@mui/icons-material/Delete";
import CommonFields from "./CommonFields";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import Validation from "../../utiliy/validations";

const AllowedToOrder = () => {
  const { users, main,companies } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);
  const [isEditFields, setIsEditFields] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [locationList, setLocationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [errors, setErrors] = useState({});
  const [inputFields, setInputFields] = useState({});

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
  };

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(
      users?.userId,
      companies?.currentCompanyId
    );
    setLocationList(res?.data?.data);
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
  return (
    <>
      <Container fluid className="mt-4">
        <MainTitle label="تعداد مجاز سفارش فروشگاه‌ها" />
        <Card className=" shadow bg-white border pointer">
          <div className="m-2">
            <div className="d-flex gap-3">
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
                displayExpr="positionName"
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
            </Row>
            <Col className="d-flex justify-content-end" xxl={12} xl={12}>
              <Button
                // onClick={() => setShowAdd(true)}
                className="mt-2"
                type="default"
                icon={<SearchIcon className="d-flex ms-2 font18" />}
                label="جستجو"
              />
            </Col>
          </div>
        </Card>
        {showCopy && (
          <GroupCopy
            locPosSupp={true}
            showCopy={showCopy}
            setShowCopy={setShowCopy}
          />
        )}
        {showDelete && (
          <GroupDelete
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
      </Container>
    </>
  );
};

export default AllowedToOrder;
