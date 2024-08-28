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
import GroupAdd from "./GroupAdd";
import Table from "../common/Tables/Table";
import StringHelpers, {
  Gfn_ExportToExcel,
  Gfn_FormatNumber,
} from "../../utiliy/GlobalMethods";
import GroupDelete from "./GroupDelete";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DataGridDefaultHeight,
  DataGridDefaultPageSize,
  DataGridPageSizes,
} from "../../config/config";
import { DataGrid } from "devextreme-react";
import {
  FilterPanel,
  FilterRow,
  HeaderFilter,
  Pager,
  Paging,
  Scrolling,
} from "devextreme-react/data-grid";
import { DataGridLocationPositionOrderNumberColumns } from "../locationPositionOrderNumber/LocationPositionOrderNumber-config";
import { userLocationListUserId } from "../../redux/reducers/user/user-actions";
import { RsetShowToast } from "../../redux/reducers/main/main-slice";
import { positionListWithCompanyId } from "../../redux/reducers/position/position-actions";
import { supplierByCompanyId } from "../../redux/reducers/supplier/supplier-action";
import {
  listTablePositionOrderNumb,
  locationPositionOrderNumberList,
  selectLocationPositionOrderNumber,
} from "../../redux/reducers/locationPositionOrderNumber/locationPositionOrderNumber-actions";
import SearchIcon from "@mui/icons-material/Search";
import ArticleIcon from "@mui/icons-material/Article";

const AllowedToOrder = () => {
  const { users, main, companies } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);
  const [isEditFields, setIsEditFields] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [inputFields, setInputFields] = useState({});
  const [locationList, setLocationList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [positionList, setPositionList] = useState([]);
  const [
    locationPositionOrderNumberGridData,
    setLocationPositionOrderNumberGridData,
  ] = useState(null);
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

  const btnExportExcel = () => {
    Gfn_ExportToExcel(
      locationPositionOrderNumberGridData,
      "LocationPositionOrderNumber"
    );
  };

  const handleLocationList = asyncWrapper(async () => {
    const res = await userLocationListUserId(users?.userId);
    setLocationList(res?.data);
  });

  const mountLists = () => {
    handleLocationList();
    handleSupplierList();
    handlePositionList();
    listTable();
  };

  useEffect(() => {
    mountLists();
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
      setLocationPositionOrderNumberGridData(data);
      dispatch(
        RsetShowToast({
          isToastVisible: true,
          Message: message || "لطفا دوباره امتحان کنید",
          Type: status,
        })
      );
    }
  });

  const listTable = asyncWrapper(async () => {
    const res = await listTablePositionOrderNumb(companies.currentCompanyId);
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
  });

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
      </div>
      {showCopy && (
        <GroupCopy
          mountLists={mountLists}
          isEditFields={isEditFields}
          locPosSupp={true}
          showCopy={showCopy}
          setShowCopy={setShowCopy}
        />
      )}
      {showDelete && (
        <GroupDelete
          mountLists={mountLists}
          isEditFields={isEditFields}
          locPosSupp={true}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
        />
      )}
      {showAdd && (
        <GroupAdd
          mountLists={mountLists}
          isEditFields={isEditFields}
          locPosSupp={true}
          showAdd={showAdd}
          setShowAdd={setShowAdd}
        />
      )}
      <Row className="standardSpaceTop">
        <Col xs="auto" className="standardMarginRight">
          <DataGrid
            dataSource={locationPositionOrderNumberGridData}
            defaultColumns={DataGridLocationPositionOrderNumberColumns}
            showBorders={true}
            rtlEnabled={true}
            allowColumnResizing={true}
            height={DataGridDefaultHeight}
          >
            <Scrolling
              rowRenderingMode="virtual"
              showScrollbar="always"
              columnRenderingMode="virtual"
            />

            <Paging defaultPageSize={DataGridDefaultPageSize} />
            <Pager
              visible={true}
              allowedPageSizes={DataGridPageSizes}
              showPageSizeSelector={true}
              showNavigationButtons={true}
            />
            <FilterRow visible={true} />
            <HeaderFilter
              texts={{ cancel: "لغو", ok: "تایید" }}
              visible={true}
            />
            <FilterPanel visible={true} />
          </DataGrid>
        </Col>
      </Row>
      <Toastify />
    </>
  );
};

export default AllowedToOrder;
